
const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `JobConnect <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to JobConnect!',
    html: `
      <h2>Welcome to JobConnect, ${name}!</h2>
      <p>Thank you for joining our government job portal. We're excited to help you find your dream job.</p>
      <p>You can now:</p>
      <ul>
        <li>Browse available government jobs</li>
        <li>Apply for positions</li>
        <li>Take mock tests</li>
        <li>Upload certificates</li>
      </ul>
      <p>Best regards,<br>JobConnect Team</p>
    `
  }),

  applicationReceived: (studentName, jobTitle) => ({
    subject: 'New Job Application Received',
    html: `
      <h2>New Application Received</h2>
      <p>Hello!</p>
      <p><strong>${studentName}</strong> has applied for the position of <strong>${jobTitle}</strong>.</p>
      <p>Please log in to your dashboard to review the application.</p>
      <p>Best regards,<br>JobConnect Team</p>
    `
  }),

  applicationStatusUpdate: (studentName, jobTitle, status) => ({
    subject: `Application Status Update - ${jobTitle}`,
    html: `
      <h2>Application Status Update</h2>
      <p>Hello ${studentName},</p>
      <p>Your application for <strong>${jobTitle}</strong> has been <strong>${status}</strong>.</p>
      <p>Please log in to your dashboard for more details.</p>
      <p>Best regards,<br>JobConnect Team</p>
    `
  }),

  certificateStatusUpdate: (studentName, certificateName, status) => ({
    subject: `Certificate Verification Update - ${certificateName}`,
    html: `
      <h2>Certificate Status Update</h2>
      <p>Hello ${studentName},</p>
      <p>Your certificate <strong>${certificateName}</strong> has been <strong>${status}</strong>.</p>
      <p>Please log in to your dashboard for more details.</p>
      <p>Best regards,<br>JobConnect Team</p>
    `
  })
};

module.exports = {
  sendEmail,
  emailTemplates
};
