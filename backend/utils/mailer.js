import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendResetOTP = async (toEmail, otp, userName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"MAKSAA Analyser" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🔐 Password Reset Code — MAKSAA Analyser',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #f2faf5; padding: 40px 20px;">
        <div style="background: #ffffff; border-radius: 20px; padding: 40px; border: 1px solid #e9edf7; box-shadow: 0 18px 40px rgba(0,168,120,0.08);">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #1b254b; text-transform: uppercase; letter-spacing: 1px;">
              MAKSAA <span style="color: #00a878;">ANALYSER</span>
            </h1>
          </div>
          
          <!-- Body -->
          <h2 style="color: #1b254b; font-size: 20px; font-weight: 800; margin: 0 0 10px 0;">Password Reset</h2>
          <p style="color: #a3aed0; font-size: 14px; line-height: 1.6; margin: 0 0 25px 0;">
            Hi <strong style="color: #1b254b;">${userName || 'there'}</strong>, we received a request to reset your password. Use the code below:
          </p>
          
          <!-- OTP Code -->
          <div style="background: #f2faf5; border: 2px dashed #00a878; border-radius: 16px; padding: 25px; text-align: center; margin: 0 0 25px 0;">
            <span style="font-size: 36px; font-weight: 900; letter-spacing: 12px; color: #00a878; font-family: monospace;">
              ${otp}
            </span>
          </div>
          
          <p style="color: #a3aed0; font-size: 13px; line-height: 1.6; margin: 0 0 20px 0;">
            This code expires in <strong style="color: #1b254b;">10 minutes</strong>. If you didn't request this, please ignore this email.
          </p>
          
          <!-- Footer -->
          <div style="border-top: 1px solid #e9edf7; padding-top: 20px; margin-top: 20px;">
            <p style="color: #a3aed0; font-size: 11px; text-align: center; margin: 0;">
              © 2026 MAKSAA Technologies · AI-Powered GST Analysis
            </p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
