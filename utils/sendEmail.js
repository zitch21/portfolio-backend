// portfolio-backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Configure the transporter with HARDCODED credentials
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // ⚠️ TYPE YOUR REAL EMAIL HERE
      pass: process.env.EMAIL_PASS           // ⚠️ TYPE YOUR 16-LETTER APP PASSWORD HERE (no spaces)
    }
  });

  // 2. Draft the email details
  const mailOptions = {
    from: `"EJPB Portfolio Test" <${process.env.EMAIL_USER}>`, // ⚠️ TYPE YOUR REAL EMAIL HERE TOO
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  // 3. Execute the send command
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;