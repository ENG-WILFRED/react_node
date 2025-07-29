const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");

router.post("/signup", auth.signup);
router.post("/login", auth.login);

// Email verification
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerificationEmail);

// Password reset
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get('/user/:id', authController.getUserById);

module.exports = router;
