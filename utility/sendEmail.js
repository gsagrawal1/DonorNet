const nodemailer = require('nodemailer');
const path = require('path');

const sendEmail = async (to, subject, text, name) => {
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
      <h2 style="color:#d62828;">Your DonorNet OTP</h2>
      <p style="color:#333; font-size:15px; line-height:1.6;">
        Dear ${name},
      </p>

      <p style="color:#333; font-size:15px; line-height:1.6;">
        Please use the following One-Time Password (OTP) to verify your account or complete your action on <strong>DonorNet</strong>.
      </p>

      <div style="background-color:#d62828; color:#ffffff; padding:15px; border-radius:8px; text-align:center; margin:20px 0;">
        <h1 style="margin:0; font-size:32px; letter-spacing:3px;">${text}</h1>
      </div>

      <p style="color:#333; font-size:14px; line-height:1.6;">
        This OTP is valid for the next <strong>5 minutes</strong>. Please do not share this code with anyone.
      </p>

      <p style="color:#333; font-size:14px; line-height:1.6;">
        If you did not request this OTP, please ignore this email.
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
        cid: 'donornetlogo' // same cid as in HTML img src
      }]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
