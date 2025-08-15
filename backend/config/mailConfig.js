// config/mailConfig.js  
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., 'smtp.gmail.com'
  port: process.env.EMAIL_PORT, // e.g., 587
  secure: false, // true for 465, false for other ports like 587
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS, // your app password or SMTP password
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer Transport Error:', error);
  } else {
    console.log('Nodemailer is ready to send emails');
  }
});

module.exports = transporter;
