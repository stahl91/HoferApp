import { auth } from "../../../../../auth";
import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const updated = await prisma.sessionRecord.updateMany({
    where: {
      id,
      userId: session.user.id,
      paymentStatus: "UNPAID",
    },
    data: {
      paymentStatus: "PAID",
    },
  });

  if (updated.count === 0) {
    return NextResponse.json(
      { error: "Session not found or already paid" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
