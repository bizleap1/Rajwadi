import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const UpdateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  addresses: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(2),
        phone: z.string(),
        address: z.string().min(6),
        city: z.string().min(2),
        state: z.string().min(2),
        pincode: z.string().regex(/^\d{6}$/),
        isDefault: z.boolean().default(false),
      })
    )
    .optional(),
});

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        addresses: {
          orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Deduplicate addresses before returning to client
    const seenAddresses = new Set<string>();
    const dedupedAddresses: Array<{
      id: string;
      name: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      isDefault: boolean;
    }> = [];

    for (const a of user.addresses) {
      const key = `${(a.address || "").trim().toLowerCase()}|${(a.pincode || "").trim()}|${(a.city || "").trim().toLowerCase()}`;
      if (!seenAddresses.has(key)) {
        seenAddresses.add(key);
        dedupedAddresses.push({
          id: a.id,
          name: a.name,
          phone: a.phone,
          address: a.address,
          city: a.city,
          state: a.state,
          pincode: a.pincode,
          isDefault: a.isDefault,
        });
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
      addresses: dedupedAddresses,
    });
  } catch (error) {
    console.error("GET /api/account/profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = UpdateProfileSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { name, phone, addresses } = validated.data;

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          name: name || undefined,
          phone: phone !== undefined ? phone : undefined,
        },
      });

      if (addresses) {
        // Deduplicate incoming addresses based on address + pincode + city
        const seen = new Set<string>();
        const uniqueAddresses: typeof addresses = [];
        for (const a of addresses) {
          const key = `${(a.address || "").trim().toLowerCase()}|${(a.pincode || "").trim()}|${(a.city || "").trim().toLowerCase()}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueAddresses.push(a);
          }
        }

        // Ensure at least one default if list is not empty
        const hasDefault = uniqueAddresses.some((a) => a.isDefault);
        if (!hasDefault && uniqueAddresses.length > 0) {
          uniqueAddresses[0].isDefault = true;
        }

        // Remove existing addresses and replace with clean deduplicated list
        await tx.address.deleteMany({
          where: { userId: session.user.id },
        });

        if (uniqueAddresses.length > 0) {
          await tx.address.createMany({
            data: uniqueAddresses.map((a) => ({
              userId: session.user.id,
              name: a.name.trim(),
              phone: a.phone.trim(),
              address: a.address.trim(),
              city: a.city.trim(),
              state: a.state.trim(),
              pincode: a.pincode.trim(),
              isDefault: a.isDefault,
            })),
          });
        }
      }
    });

    return NextResponse.json({ success: true, message: "Profile updated successfully." });
  } catch (error) {
    console.error("PUT /api/account/profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
