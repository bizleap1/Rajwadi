import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendRawEmail, OWNER_ORDER_EMAIL } from "@/backend/services/email";

export const dynamic = "force-dynamic";

const ContactEnquirySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address"),
  mobile: z.string().trim().min(10, "Mobile number must be at least 10 digits").max(20),
  occasion: z.string().trim().optional().default("Bridal & Royal Poshak"),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = ContactEnquirySchema.safeParse(body);

    if (!parseResult.success) {
      const errorMsg = Object.values(parseResult.error.flatten().fieldErrors)
        .flat()
        .join(", ");
      return NextResponse.json(
        { error: errorMsg || "Invalid enquiry submission" },
        { status: 400 }
      );
    }

    const { name, email, mobile, occasion, message } = parseResult.data;
    const ownerEmail = OWNER_ORDER_EMAIL.trim().toLowerCase();
    const dateFormatted = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // 1. Dispatch Email to Atelier Owner (bizleap1@gmail.com)
    const ownerSubject = `👑 [New Atelier Enquiry] ${name} — ${occasion}`;
    const ownerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Patron Enquiry</title>
</head>
<body style="margin:0; padding:24px; background:#FAF6F0; font-family:'Segoe UI',Roboto,Helvetica,sans-serif; color:#171717;">
  <table role="presentation" width="100%" max-width="600" align="center" style="max-width:600px; background:#FFFFFF; border:1px solid #E6DCB8; border-radius:4px; overflow:hidden;">
    <tr>
      <td style="background:#581522; padding:24px; text-align:center;">
        <h1 style="margin:0; font-family:Georgia,serif; font-size:22px; color:#FAF5EE; letter-spacing:3px; text-transform:uppercase;">RAJWADI</h1>
        <p style="margin:4px 0 0; color:#D4AF37; font-size:11px; letter-spacing:2px; text-transform:uppercase;">Authentic Imperial Rajputi Atelier • Nagpur</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 24px;">
        <h2 style="margin:0 0 16px; font-family:Georgia,serif; font-size:18px; color:#581522; border-bottom:1px solid #E6DCB8; padding-bottom:8px;">
          👑 New Patron Enquiry Details
        </h2>
        <table role="presentation" width="100%" style="font-size:14px; line-height:1.6; color:#333;">
          <tr>
            <td width="140" style="padding:6px 0; color:#855D25; font-weight:600;">Patron Name:</td>
            <td style="padding:6px 0; font-weight:bold; color:#171717;">${name}</td>
          </tr>
          <tr>
            <td style="padding:6px 0; color:#855D25; font-weight:600;">Phone / WhatsApp:</td>
            <td style="padding:6px 0;"><a href="tel:${mobile}" style="color:#581522; text-decoration:none; font-weight:bold;">${mobile}</a></td>
          </tr>
          <tr>
            <td style="padding:6px 0; color:#855D25; font-weight:600;">Email Address:</td>
            <td style="padding:6px 0;"><a href="mailto:${email}" style="color:#581522; text-decoration:none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:6px 0; color:#855D25; font-weight:600;">Category / Occasion:</td>
            <td style="padding:6px 0; font-weight:600; color:#171717;">${occasion}</td>
          </tr>
          <tr>
            <td style="padding:6px 0; color:#855D25; font-weight:600;">Received At:</td>
            <td style="padding:6px 0; color:#666;">${dateFormatted} IST</td>
          </tr>
        </table>

        <div style="margin-top:20px; padding:16px; background:#FAF6F0; border-left:3px solid #855D25; border-radius:2px;">
          <strong style="display:block; color:#581522; font-size:12px; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">Enquiry Message:</strong>
          <p style="margin:0; font-size:14px; color:#4A423B; white-space:pre-wrap; line-height:1.6;">${message}</p>
        </div>

        <div style="margin-top:24px; text-align:center;">
          <a href="https://wa.me/${mobile.replace(/[^0-9]/g, "")}" style="display:inline-block; padding:12px 24px; background:#25D366; color:#ffffff; font-size:12px; font-weight:bold; text-decoration:none; text-transform:uppercase; letter-spacing:1px; border-radius:3px; margin-right:8px;">
            Reply on WhatsApp
          </a>
          <a href="mailto:${email}?subject=Regarding%20Your%20Rajwadi%20Poshak%20Enquiry" style="display:inline-block; padding:12px 24px; background:#581522; color:#ffffff; font-size:12px; font-weight:bold; text-decoration:none; text-transform:uppercase; letter-spacing:1px; border-radius:3px;">
            Reply via Email
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background:#F4EFE6; padding:16px; text-align:center; font-size:11px; color:#7A6E65;">
        Rajwadi Rajputi Poshak • EWS 41, near Maheshwari Bhawan, Hiwari Layout, Nagpur, Maharashtra 440008<br>
        Direct Helpline: +91 8766667101 • support@rajwadirajputiposhak.com
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // 2. Dispatch Patron Confirmation Email
    const patronSubject = `👑 Thank You for Contacting Rajwadi Rajputi Poshak Atelier`;
    const patronHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Rajwadi Atelier Enquiry</title>
</head>
<body style="margin:0; padding:24px; background:#FAF6F0; font-family:'Segoe UI',Roboto,Helvetica,sans-serif; color:#171717;">
  <table role="presentation" width="100%" max-width="600" align="center" style="max-width:600px; background:#FFFFFF; border:1px solid #E6DCB8; border-radius:4px; overflow:hidden;">
    <tr>
      <td style="background:#581522; padding:24px; text-align:center;">
        <h1 style="margin:0; font-family:Georgia,serif; font-size:22px; color:#FAF5EE; letter-spacing:3px; text-transform:uppercase;">RAJWADI</h1>
        <p style="margin:4px 0 0; color:#D4AF37; font-size:11px; letter-spacing:2px; text-transform:uppercase;">Authentic Imperial Rajputi Atelier</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 24px;">
        <p style="margin:0 0 12px; font-size:16px; color:#171717;">Dear <strong>${name}</strong>,</p>
        <p style="font-size:14px; line-height:1.6; color:#4A423B;">
          Thank you for reaching out to Rajwadi Rajputi Poshak. We have received your styling inquiry regarding <strong>${occasion}</strong>.
        </p>
        <p style="font-size:14px; line-height:1.6; color:#4A423B;">
          Our master bridal stylist and concierge team will personally review your requirements and connect with you shortly on your phone/WhatsApp (<strong>${mobile}</strong>) or email.
        </p>
        <div style="margin:20px 0; padding:16px; background:#FAF6F0; border-left:3px solid #855D25;">
          <p style="margin:0; font-size:13px; color:#581522; font-weight:600;">Need immediate bridal assistance or urgent custom tailoring?</p>
          <p style="margin:4px 0 0; font-size:13px; color:#4A423B;">
            Feel free to call or WhatsApp our atelier concierge directly at <strong>+91 8766667101</strong> (Daily 11:00 AM – 8:30 PM IST).
          </p>
        </div>
        <p style="font-size:13px; color:#6B635B; line-height:1.5;">
          Warm regards,<br>
          <strong>Rajwadi Atelier Concierge</strong><br>
          Nagpur, Maharashtra, India
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Dispatch emails in parallel without blocking response on failure
    Promise.allSettled([
      sendRawEmail({
        to: ownerEmail,
        subject: ownerSubject,
        html: ownerHtml,
        text: `New Enquiry from ${name} (${mobile}, ${email}): ${occasion} - ${message}`,
      }),
      sendRawEmail({
        to: email,
        subject: patronSubject,
        html: patronHtml,
        text: `Dear ${name}, thank you for contacting Rajwadi Rajputi Poshak. Our concierge will connect with you soon. Helpline: +91 8766667101.`,
      }),
    ]).catch((err) => {
      console.warn("[Contact Route] Email dispatch warning:", err);
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting Rajwadi. Our concierge will be in touch shortly.",
    });
  } catch (error: any) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while submitting your enquiry. Please try again or WhatsApp us directly." },
      { status: 500 }
    );
  }
}
