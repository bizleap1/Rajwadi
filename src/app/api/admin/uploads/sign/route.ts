import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { generateSignedUploadParams, isCloudinaryConfigured } from "@/lib/cloudinary";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit admin uploads to 60 signature requests per minute
  const ip = getClientIp(req.headers);
  const rateLimit = checkRateLimit(`upload-sign:${admin.user.id}:${ip}`, {
    windowMs: 60_000,
    maxRequests: 60,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many upload requests. Please slow down." },
      { status: 429 }
    );
  }

  if (!isCloudinaryConfigured) {
    return NextResponse.json(
      {
        error:
          "Cloudinary credentials are not configured in environment variables. Please provide CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        isConfigured: false,
      },
      { status: 503 }
    );
  }

  try {
    const params = generateSignedUploadParams("rajwadi/products");
    return NextResponse.json({
      ...params,
      isConfigured: true,
    });
  } catch (error: any) {
    console.error("Cloudinary sign error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}
