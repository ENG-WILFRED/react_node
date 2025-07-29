// File: controllers/authController.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");
const {
  sendWelcomeEmail,
  sendOtpEmail,
  sendResetConfirmationEmail,
} = require("../utils/emailTemplates");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const OTP_EXPIRATION_MINUTES = 10;

function isValidPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
}

exports.signup = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters and contain a number and a letter.",
    });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ error: "Email already in use." });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, role },
    });

    await sendWelcomeEmail(email, role);
    return res.status(201).json({
      message: "User created",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials." });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    await sendWelcomeEmail(email, user.role); // Optional: Remove if you only want to send on signup

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: "Server error." });
  }
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60000);

    await prisma.oTP.create({
      data: {
        code: otp,
        userId: user.id,
        expiresAt,
      },
    });

    await sendOtpEmail(email, otp);
    return res.json({ message: "OTP sent successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Server error." });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found." });

    const record = await prisma.oTP.findFirst({
      where: { userId: user.id, code: otp, used: false },
      orderBy: { expiresAt: "desc" },
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    await prisma.oTP.update({
      where: { id: record.id },
      data: { used: true },
    });

    return res.json({ message: "OTP verified." });
  } catch (err) {
    return res.status(500).json({ error: "Server error." });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60000);

    await prisma.resetToken.create({
      data: { token: otp, userId: user.id, expiresAt },
    });

    await sendResetConfirmationEmail(email, otp);
    return res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    return res.status(500).json({ error: "Server error." });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!isValidPassword(newPassword)) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters and contain a number and a letter.",
    });
  }

  try {
    const resetRecord = await prisma.resetToken.findUnique({
      where: { token },
    });

    if (
      !resetRecord ||
      resetRecord.expiresAt < new Date() ||
      resetRecord.used
    ) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash: hashed },
    });

    await prisma.resetToken.update({
      where: { token },
      data: { used: true },
    });

    return res.json({ message: "Password reset successful." });
  } catch (err) {
    return res.status(500).json({ error: "Server error." });
  }
};
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: "Server error." });
  }
};
