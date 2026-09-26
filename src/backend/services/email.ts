import nodemailer, { type Transporter } from "nodemailer";
import prisma from "@/lib/prisma";
import { generateReceiptHtml, type ReceiptOrderData } from "./receipt";

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

/**
 * Designated Owner Notification Email (bizleap1@gmail.com default)
 */
export const OWNER_ORDER_EMAIL = process.env.OWNER_EMAIL || "bizleap1@gmail.com";

interface SendRawEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Universal raw email sender via Resend API with domain fallback & SMTP support.
 */
export async function sendRawEmail({
  to,
  subject,
  html,
  text,
}: SendRawEmailParams): Promise<{ success: boolean; error?: string }> {
  // 1. If Resend is configured, send via Resend API
  if (isResendConfigured) {
    try {
      let res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [to],
          subject,
          html,
          text,
        }),
      });

      let resData = await res.json().catch(() => ({}));

      // Domain verification fallback: if unverified domain, retry with Resend onboarding address
      if (
        !res.ok &&
        resData?.message &&
        typeof resData.message === "string" &&
        (resData.message.toLowerCase().includes("domain") ||
          resData.message.toLowerCase().includes("verify") ||
          res.status === 403)
      ) {
        console.warn(
          `[Email Service] Retrying delivery to ${to} via Resend onboarding domain...`
        );
        res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Rajwadi Couture <onboarding@resend.dev>",
            to: [to],
            subject,
            html,
            text,
          }),
        });
        resData = await res.json().catch(() => ({}));
      }

      if (!res.ok) {
        throw new Error(resData?.message || `Resend API returned status ${res.status}`);
      }

      console.log(`✓ Email delivered to ${to} via Resend (ID: ${resData.id || "ok"}).`);
      return { success: true };
    } catch (err: any) {
      console.error(`✗ Resend delivery error for ${to}:`, err.message || err);
      // Fall through to SMTP if available
    }
  }

  // 2. If SMTP is configured, send via SMTP
  if (transporter) {
    try {
      await transporter.sendMail({
        from: emailFrom,
        to,
        subject,
        html,
        text,
      });
      console.log(`✓ Email delivered to ${to} via SMTP.`);
      return { success: true };
    } catch (err: any) {
      console.error(`✗ SMTP delivery error for ${to}:`, err.message || err);
      return { success: false, error: err.message || "SMTP error" };
    }
  }

  // 3. Simulated delivery in development
  console.log(`ℹ [Dev Mailbox] Simulated email sent to ${to}: "${subject}"`);
  return { success: true };
}

export interface SendOrderInvoiceResult {
  customerSent: boolean;
  ownerSent: boolean;
  orderNumber?: string;
  errors?: string[];
}

/**
 * Dispatches the official Rajwadi Tax Invoice to both the Customer and the Owner (bizleap1@gmail.com).
 * Runs safely without blocking or throwing unhandled errors.
 */
export async function sendOrderInvoiceEmail(
  orderOrId: string | ReceiptOrderData,
  customerEmailOverride?: string
): Promise<SendOrderInvoiceResult> {
  const errors: string[] = [];
  let orderData: ReceiptOrderData;

  try {
    if (typeof orderOrId === "string") {
      const orderRecord = await prisma.order.findFirst({
        where: {
          OR: [{ id: orderOrId }, { orderNumber: orderOrId }],
        },
        include: {
          items: true,
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      if (!orderRecord) {
        console.error(`[Invoice Email] Order with ID ${orderOrId} not found.`);
        return { customerSent: false, ownerSent: false, errors: ["Order not found"] };
      }

      orderData = {
        id: orderRecord.id,
        orderNumber: orderRecord.orderNumber,
        createdAt: orderRecord.createdAt.toISOString(),
        guestEmail: orderRecord.guestEmail || undefined,
        paymentStatus: orderRecord.paymentStatus,
        paymentMethod: orderRecord.paymentMethod,
        razorpayPaymentId: orderRecord.razorpayPaymentId || undefined,
        utrNumber: orderRecord.utrNumber || undefined,
        subtotalInPaise: orderRecord.subtotalInPaise,
        stitchingInPaise: orderRecord.stitchingInPaise,
        shippingInPaise: orderRecord.shippingInPaise,
        discountInPaise: orderRecord.discountInPaise,
        totalInPaise: orderRecord.totalInPaise,
        shippingAddress: orderRecord.shippingAddress,
        user: orderRecord.user
          ? {
              name: orderRecord.user.name || undefined,
              email: orderRecord.user.email || undefined,
              phone: orderRecord.user.phone || undefined,
            }
          : undefined,
        items: orderRecord.items.map((it) => ({
          id: it.id,
          productName: it.productName,
          category: it.category || undefined,
          size: it.size || undefined,
          stitchingSelected: it.stitchingSelected,
          stitchingPriceInPaise: it.stitchingPriceInPaise,
          unitPriceInPaise: it.unitPriceInPaise,
          quantity: it.quantity,
          totalInPaise: it.totalInPaise,
        })),
      };
    } else {
      orderData = orderOrId;
    }

    const orderNum = orderData.orderNumber || orderData.id || "ORD";
    const totalRupees = ((orderData.totalInPaise ?? 0) / 100).toLocaleString("en-IN");

    // Extract customer email with comprehensive fallback hierarchy
    let customerEmail = customerEmailOverride?.trim()?.toLowerCase();
    if (!customerEmail && orderData.guestEmail) {
      customerEmail = orderData.guestEmail.trim().toLowerCase();
    }
    if (!customerEmail && orderData.user?.email) {
      customerEmail = orderData.user.email.trim().toLowerCase();
    }
    if (!customerEmail && orderData.shippingAddress) {
      let addr: any = orderData.shippingAddress;
      if (typeof addr === "string") {
        try {
          addr = JSON.parse(addr);
        } catch {}
      }
      if (addr && addr.email) {
        customerEmail = String(addr.email).trim().toLowerCase();
      }
    }

    // Extract patron name
    let patronName = orderData.user?.name || "Valued Patron";
    if (orderData.shippingAddress) {
      let addr: any = orderData.shippingAddress;
      if (typeof addr === "string") {
        try {
          addr = JSON.parse(addr);
        } catch {}
      }
      if (addr && (addr.fullName || addr.name)) {
        patronName = addr.fullName || addr.name;
      }
    }

    const ownerEmail = OWNER_ORDER_EMAIL.trim().toLowerCase();

    console.log("\n=======================================================");
    console.log(` 👑 DISPATCHING RAJWADI TAX INVOICE EMAILS`);
    console.log(` Order Ref     : #${orderNum}`);
    console.log(` Total Amount  : ₹${totalRupees}`);
    console.log(` Customer Mail : ${customerEmail || "Not provided"}`);
    console.log(` Owner Mail    : ${ownerEmail}`);
    console.log("=======================================================\n");

    // 1. Generate Customer Confirmation Email
    const customerSubject = `👑 Order Confirmed: Your Rajwadi Couture Tax Invoice #${orderNum}`;
    const customerHtml = generateReceiptHtml(orderData, {
      isEmail: true,
      emailRecipientType: "customer",
    });
    const customerText = `Rajwadi Rajputi Poshak — Order Confirmation\nOrder Reference: #${orderNum}\nTotal Amount: ₹${totalRupees}\nStatus: ${orderData.paymentStatus || "PENDING"}\n\nDear ${patronName},\nThank you for placing your order with Rajwadi Haute Couture. Your official tax invoice has been generated.\nFor any assistance, please write to royal@rajwadirajputiposhak.com.`;

    // 2. Generate Owner Alert Email
    const ownerSubject = `👑 [New Order Alert] Rajwadi #${orderNum} — ₹${totalRupees}`;
    const ownerHtml = generateReceiptHtml(orderData, {
      isEmail: true,
      emailRecipientType: "owner",
    });
    const ownerText = `👑 NEW ORDER ALERT #${orderNum}\nCustomer: ${patronName}\nEmail: ${customerEmail || "N/A"}\nAmount: ₹${totalRupees}\nPayment Method: ${orderData.paymentMethod || "UPI"}\nStatus: ${orderData.paymentStatus || "PENDING"}\n\nCheck full details in your admin dashboard: /admin/orders`;

    // 3. Dispatch both in parallel
    const [customerRes, ownerRes] = await Promise.allSettled([
      customerEmail
        ? sendRawEmail({
            to: customerEmail,
            subject: customerSubject,
            html: customerHtml,
            text: customerText,
          })
        : Promise.resolve({ success: false, error: "No customer email available" }),
      sendRawEmail({
        to: ownerEmail,
        subject: ownerSubject,
        html: ownerHtml,
        text: ownerText,
      }),
    ]);

    const customerSent = customerRes.status === "fulfilled" && customerRes.value.success;
    const ownerSent = ownerRes.status === "fulfilled" && ownerRes.value.success;

    if (customerRes.status === "fulfilled" && !customerRes.value.success && customerRes.value.error) {
      errors.push(`Customer email: ${customerRes.value.error}`);
    } else if (customerRes.status === "rejected") {
      errors.push(`Customer email rejection: ${customerRes.reason}`);
    }

    if (ownerRes.status === "fulfilled" && !ownerRes.value.success && ownerRes.value.error) {
      errors.push(`Owner email: ${ownerRes.value.error}`);
    } else if (ownerRes.status === "rejected") {
      errors.push(`Owner email rejection: ${ownerRes.reason}`);
    }

    console.log(
      `[Invoice Dispatch Summary] Order #${orderNum} => Customer (${customerEmail || "N/A"}): ${
        customerSent ? "SUCCESS" : "FAILED"
      }, Owner (${ownerEmail}): ${ownerSent ? "SUCCESS" : "FAILED"}`
    );

    return {
      customerSent,
      ownerSent,
      orderNumber: orderNum,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (err: any) {
    console.error(`[Invoice Email Fatal] Failed to dispatch invoice for order:`, err);
    return {
      customerSent: false,
      ownerSent: false,
      errors: [err.message || "Unknown dispatch failure"],
    };
  }
}
