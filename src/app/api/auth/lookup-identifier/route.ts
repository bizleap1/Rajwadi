import { NextResponse } from "next/server";
import prisma from "@/backend/db/prisma";

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json();
    if (!identifier || typeof identifier !== "string") {
      return NextResponse.json(
        { error: "Please enter your mobile number or email address." },
        { status: 400 }
      );
    }

    const trimmed = identifier.trim().toLowerCase();

    // If identifier contains '@', it is already an email address
    if (trimmed.includes("@")) {
      return NextResponse.json({ email: trimmed });
    }

    // Otherwise, treat as phone number (strip spaces, dashes, +91)
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number or email address." },
        { status: 400 }
      );
    }

    const last10 = digits.slice(-10);

    // Look up user by phone number
    const user = await prisma.user.findFirst({
      where: {
        phone: {
          contains: last10,
        },
      },
      select: {
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "No account found with this mobile number. Please check the number or click 'Create Account'.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ email: user.email, name: user.name });
  } catch (error: any) {
    console.error("Lookup identifier error:", error);
    return NextResponse.json(
      { error: "Failed to verify identifier. Please try again." },
      { status: 500 }
    );
  }
}
