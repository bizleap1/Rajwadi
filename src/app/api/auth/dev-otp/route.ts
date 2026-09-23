import { NextRequest, NextResponse } from "next/server";
import { getLatestDevOtp } from "@/backend/services/email";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ otp: null }, { status: 400 });
  }

  const otp = getLatestDevOtp(email);
  return NextResponse.json({
    otp,
    isDev: process.env.NODE_ENV !== "production",
  });
}
