import { NextRequest, NextResponse } from "next/server";
import { cloudinary, isCloudinaryConfigured } from "@/backend/services/cloudinary";
import { checkRateLimit, getClientIp } from "@/backend/security/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Rate limit: 20 screenshot uploads per minute per IP
  const ip = getClientIp(req.headers);
  const rateLimit = checkRateLimit(`screenshot-upload:${ip}`, {
    windowMs: 60_000,
    maxRequests: 20,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many upload requests. Please wait a moment." },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("screenshot") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No screenshot file provided." },
        { status: 400 }
      );
    }

    // Validate mime type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/heic"];
    if (!validMimes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp|heic)$/i)) {
      return NextResponse.json(
        { error: "Please upload a valid image file (JPG, PNG, or WebP)." },
        { status: 400 }
      );
    }

    // Limit size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit. Please upload a smaller image." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Cloudinary is configured, attempt upload to Cloudinary
    if (isCloudinaryConfigured) {
      try {
        const uploadPromise = new Promise<{ secure_url: string; public_id: string }>(
          (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: "rajwadi/payment_proofs",
                resource_type: "image",
              },
              (error, result) => {
                if (error || !result) {
                  reject(error || new Error("Upload failed"));
                } else {
                  resolve(result);
                }
              }
            );
            uploadStream.end(buffer);
          }
        );

        const result = await uploadPromise;
        return NextResponse.json({
          url: result.secure_url,
          publicId: result.public_id,
          success: true,
        });
      } catch (cloudErr: any) {
        console.warn("Cloudinary upload failed, falling back to base64 Data URI:", cloudErr?.message || cloudErr);
      }
    }

    // Robust Fallback: Base64 data URL (stored in database @db.Text column)
    const base64Data = `data:${file.type || "image/png"};base64,${buffer.toString("base64")}`;
    return NextResponse.json({
      url: base64Data,
      success: true,
      fallback: true,
    });
  } catch (error: any) {
    console.error("Screenshot upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload payment screenshot." },
      { status: 500 }
    );
  }
}
