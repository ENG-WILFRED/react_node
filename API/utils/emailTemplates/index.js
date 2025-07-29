const path = require("path");
const { sendEmail } = require("../emailSend");

async function sendWelcomeEmail(to, role) {
  return sendEmail({
    to,
    subject: "Welcome to EasyTrans!",
    templateName: path.join("emailTemplates", "sendWelcomeEmail"),
    templateData: { role },
  });
}

async function sendOtpEmail(to, otp) {
  return sendEmail({
    to,
    subject: "Your EasyTrans OTP",
    templateName: path.join("emailTemplates", "sendOtpEmail"),
    templateData: { otp },
  });
}

async function sendResetConfirmationEmail(to, otp) {
  return sendEmail({
    to,
    subject: "EasyTrans Password Reset",
    templateName: path.join("emailTemplates", "sendResetConfirmationEmail"),
    templateData: { otp },
  });
}

module.exports = {
  sendWelcomeEmail,
  sendOtpEmail,
  sendResetConfirmationEmail,
};