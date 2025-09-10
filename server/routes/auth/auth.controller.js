const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { createPasswordResetToken, findUserByEmail, findPasswordResetToken, updateUserPassword, deletePasswordResetToken }= require("../../models/auth.model.js");

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS in .env file");
      return res.status(500).json({ 
        message: "Email service not configured. Please contact administrator." 
      });
    }

    // find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // save token in DB
    await createPasswordResetToken(user.id, token, expiresAt);

    // reset link
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true, // Enable debug logs
      logger: true // Enable logger
    });

    // send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset your password",
      html: `<p>You requested to reset your password.</p>
             <p>Click this link: <a href="${resetLink}">${resetLink}</a></p>
             <p>This link expires in 15 minutes.</p>`,
    });

    res.json({ message: "Password reset link sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    
    // Handle specific nodemailer errors
    if (err.code === 'EAUTH') {
      return res.status(500).json({ 
        message: "Email authentication failed. Please check email configuration." 
      });
    }
    
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  
  try {
    // Validate input
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Find valid reset token
    const resetToken = await findPasswordResetToken(token);
    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password
    await updateUserPassword(resetToken.user_id, hashedPassword);

    // Delete used reset token
    await deletePasswordResetToken(token);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { forgotPassword, resetPassword };