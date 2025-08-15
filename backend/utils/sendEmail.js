// utils/sendEmail.js
const transporter = require('../config/mailConfig');

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Pizza Delivery App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error.message);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
