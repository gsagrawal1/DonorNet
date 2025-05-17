const nodemailer = require('nodemailer');
const path = require('path');

const sendEmail = async (to, subject, donorDetails) => {
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
      <h2 style="color:#d62828;">Blood Request Accepted</h2>
      <p style="color:#333; font-size:15px; line-height:1.6;">
        We are pleased to inform you that your blood request has been <strong>accepted</strong> by the following donor:
      </p>

      <table cellpadding="8" cellspacing="0" width="100%" style="border:1px solid #d62828; border-radius:8px; margin:20px 0; background-color:#fff3f3;">
        <tr>
          <td style="color:#d62828; font-weight:bold;">Name:</td>
          <td style="color:#333;">${donorDetails.firstName} ${donorDetails.lastName}</td>
        </tr>
        <tr>
          <td style="color:#d62828; font-weight:bold;">Email:</td>
          <td style="color:#333;">${donorDetails.email}</td>
        </tr>
        <tr>
          <td style="color:#d62828; font-weight:bold;">Contact:</td>
          <td style="color:#333;">${donorDetails.phone}</td>
        </tr>
        <tr>
          <td style="color:#d62828; font-weight:bold;">Address:</td>
          <td style="color:#333;">${donorDetails.streetAddress}</td>
        </tr>
      </table>

      <p style="color:#333; font-size:14px; line-height:1.6;">
        Please reach out to the donor for further coordination. We appreciate your efforts and wish you good health.
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
