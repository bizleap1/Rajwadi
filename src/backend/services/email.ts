import nodemailer, { type Transporter } from "nodemailer";

interface SendOtpEmailOptions {
  email: string;
  otp: string;
  type: "sign-in" | "email-verification" | "forget-password" | string;
}

const resendApiKey = process.env.RESEND_API_KEY;
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASSWORD;
const emailFrom = process.env.EMAIL_FROM || '"Rajwadi Couture" <onboarding@resend.dev>';

export const isResendConfigured = Boolean(
  resendApiKey && !resendApiKey.includes("placeholder")
);

export const isSmtpConfigured = Boolean(
  smtpHost && smtpUser && smtpPass && smtpUser !== "placeholder_smtp_user"
);

let transporter: Transporter | null = null;

if (isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

/**
 * Generate a luxury royal Rajwadi branded HTML template for the 6-digit OTP email.
 */
function getOtpEmailHtml(otp: string, type: string): string {
  const title =
    type === "forget-password"
      ? "Password Reset Code"
      : type === "email-verification"
      ? "Verify Your Rajwadi Account"
      : "Your Patron Access Code";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #171717;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #FAF8F5; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="560px" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #E5DFD7; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          
          <!-- Header with Maroon Accent -->
          <tr>
            <td style="background-color: #6D1A2A; padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; letter-spacing: 0.2em; text-transform: uppercase; color: #FDFBF7; font-weight: 400;">
                RAJWADI
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #E8D8B0;">
                Authentic Royal Rajputi Heritage
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 40px 32px 32px 32px; text-align: center;">
              <h2 style="margin: 0 0 16px 0; font-family: Georgia, serif; font-size: 20px; font-weight: 500; color: #6D1A2A;">
                ${title}
              </h2>
              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #555555;">
                Welcome to the world of imperial Rajasthani craftsmanship. Please use the verification code below to securely sign into your Rajwadi account.
              </p>

              <!-- 6-digit OTP Box -->
              <div style="background-color: #FAF8F5; border: 1px dashed #C5A059; border-radius: 4px; padding: 20px; margin: 0 auto 28px auto; max-width: 280px; text-align: center;">
                <span style="font-family: monospace, Courier, sans-serif; font-size: 34px; font-weight: 700; letter-spacing: 0.3em; color: #6D1A2A; padding-left: 0.3em;">
                  ${otp}
                </span>
              </div>

              <p style="margin: 0 0 10px 0; font-size: 12px; color: #888888;">
                This code is valid for <strong>5 minutes</strong>. Do not share this code with anyone.
              </p>
              <p style="margin: 0; font-size: 12px; color: #AAAAAA;">
                If you did not request this login code, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8F5F0; border-top: 1px solid #EAE5DE; padding: 24px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; letter-spacing: 0.1em; color: #777777; text-transform: uppercase;">
                Rajwadi Luxury Couture Atelier
              </p>
              <p style="margin: 0; font-size: 11px; color: #999999;">
                Jaipur, Rajasthan, India • support@rajwadi.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Send an OTP code to the recipient via SMTP or log to development console.
 */
export async function sendOtpEmail({ email, otp, type }: SendOtpEmailOptions): Promise<boolean> {
  const subject =
    type === "forget-password"
      ? "Rajwadi: Password Reset Code"
      : type === "email-verification"
      ? "Rajwadi: Verify Your Account"
      : "Rajwadi: Your 6-Digit Patron Access Code";

  // Always log cleanly in the server console for rapid testing and visibility
  console.log("\n=======================================================");
  console.log(` 👑 RAJWADI PATRON EMAIL OTP CODE`);
  console.log(` Recipient : ${email}`);
  console.log(` OTP Code  : >>> ${otp} <<<`);
  console.log(` Type      : ${type}`);
  console.log(` Valid for : 5 minutes`);
  console.log("=======================================================\n");

  // 1. If Resend is configured, send via Resend API
  if (isResendConfigured) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [email],
          subject,
          html: getOtpEmailHtml(otp, type),
          text: `Your Rajwadi access code is: ${otp}. This code is valid for 5 minutes.`,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData?.message || "Failed to send email via Resend");
      }

      console.log(`✓ OTP email successfully delivered to ${email} via Resend API (ID: ${resData.id}).`);
      return true;
    } catch (error: any) {
      console.error(`✗ Failed to deliver OTP email to ${email} via Resend:`, error.message || error);
      return false;
    }
  }

  // 2. If SMTP is configured, send via SMTP
  if (transporter) {
    try {
      await transporter.sendMail({
        from: emailFrom,
        to: email,
        subject,
        html: getOtpEmailHtml(otp, type),
        text: `Your Rajwadi access code is: ${otp}. This code is valid for 5 minutes.`,
      });
      console.log(`✓ OTP email successfully delivered to ${email} via SMTP.`);
      return true;
    } catch (error: any) {
      console.error(`✗ Failed to deliver OTP email to ${email} via SMTP:`, error.message || error);
      return false;
    }
  }

  // 3. Fallback: Logged in console for local dev
  return true;
}
