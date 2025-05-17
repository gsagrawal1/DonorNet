const nodemailer = require('nodemailer');
const path = require('path');

const sendEmail = async (to, subject, receiver, event, host) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ghanshyamagrawal456@gmail.com',
        pass: 'ceib ucee xvzz txhi'
      }
    });

    const mailOptions = {
      from: 'ghanshyamagrawal456@gmail.com',
      to: to,
      subject: subject,
      html: `
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff; font-family:Arial, sans-serif; padding:20px;">
  <tr>
    <td align="center">
      <img src="cid:donornetlogo" alt="DonorNet Logo" width="100" style="margin-bottom:10px;">
      <h1 style="color:#d62828; margin:0;">DonorNet</h1>
      <p style="color:#555; font-size:16px; margin-top:5px;"><em>Connecting Lifelines. Empowering Hope.</em></p>
      <hr style="border:1px solid #d62828; width:50px; margin:20px auto;">
    </td>
  </tr>
  <tr>
    <td>
      <h2 style="color:#d62828;">Registration Successful!</h2>
      <p style="color:#333; font-size:15px; line-height:1.6;">
        Dear ${receiver},
      </p>

      <p style="color:#333; font-size:15px; line-height:1.6;">
        Thank you for registering for our upcoming blood donation event hosted by <strong>${host.hospitalName}</strong>. Your participation can help save lives and bring hope to those in need.
      </p>

      <table cellpadding="8" cellspacing="0" width="100%" style="border:1px solid #d62828; border-radius:8px; margin:20px 0; background-color:#fff3f3;">
        <tr>
          <td style="color:#d62828; font-weight:bold;">Event Name:</td>
          <td style="color:#333;">${event.eventName}</td>
        </tr>
        <tr>
          <td style="color:#d62828; font-weight:bold;">City:</td>
          <td style="color:#333;">${event.city}</td>
        </tr>
        <tr>
          <td style="color:#d62828; font-weight:bold;">Address:</td>
          <td style="color:#333;">${event.address}</td>
        </tr>
        <tr>
          <td style="color:#d62828; font-weight:bold;">Date:</td>
          <td style="color:#333;">${new Date(event.eventStart).toLocaleDateString()} (${event.eventTime})</td>
        </tr>
      </table>

      <p style="color:#333; font-size:14px; line-height:1.6;">
        Please arrive on time and carry a valid ID proof. We look forward to seeing you and appreciate your generosity!
      </p>

      <p style="color:#333; font-size:15px;">Warm regards,<br><strong>The DonorNet Team</strong></p>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding-top:20px;">
      <p style="font-size:12px; color:#aaa;">
        © 2025 DonorNet. All rights reserved.
      </p>
    </td>
  </tr>
</table>
      `,
      attachments: [{
        filename: 'logo.png',
        path: path.join(__dirname, 'logo.png'),
        cid: 'donornetlogo'
      }]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
