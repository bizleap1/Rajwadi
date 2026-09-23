import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const UpdateExchangeSchema = z.object({
  status: z
    .enum([
      "REQUESTED",
      "APPROVED",
      "PICKUP_SCHEDULED",
      "RECEIVED_AT_ATELIER",
      "REPLACEMENT_DISPATCHED",
      "COMPLETED",
      "REJECTED",
    ])
    .optional(),
  adminNotes: z.string().nullable().optional(),
  reverseCourierPartner: z.string().nullable().optional(),
  reverseTrackingNumber: z.string().nullable().optional(),
  replacementTrackingNumber: z.string().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const validated = UpdateExchangeSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid exchange update data", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const exchange = await prisma.exchangeRequest.findUnique({
      where: { id },
    });

    if (!exchange) {
      return NextResponse.json({ error: "Exchange request not found" }, { status: 404 });
    }

    const updateData: any = {};

    if (validated.data.status !== undefined) {
      updateData.status = validated.data.status;
    }
    if (validated.data.adminNotes !== undefined) {
      updateData.adminNotes = validated.data.adminNotes;
    }
    if (validated.data.reverseCourierPartner !== undefined) {
      updateData.reverseCourierPartner = validated.data.reverseCourierPartner;
    }
    if (validated.data.reverseTrackingNumber !== undefined) {
      updateData.reverseTrackingNumber = validated.data.reverseTrackingNumber;
    }
    if (validated.data.replacementTrackingNumber !== undefined) {
      updateData.replacementTrackingNumber = validated.data.replacementTrackingNumber;
    }

    const updated = await prisma.exchangeRequest.update({
      where: { id },
      data: updateData,
      include: {
        orderItem: true,
        order: {
          select: {
            id: true,
            orderNumber: true,
            shippingAddress: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, exchange: updated });
  } catch (error: any) {
    console.error("PATCH /api/admin/exchanges/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update exchange request" },
      { status: 500 }
    );
  }
}
