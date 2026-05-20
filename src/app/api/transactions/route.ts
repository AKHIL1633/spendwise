import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { memDb } from "@/lib/store";
import { CreateTransactionPayload } from "@/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const transactions = memDb.getAll(userId);
  const stats        = memDb.getStats(userId);
  const categories   = memDb.getCategoryStats(userId);
  const trends       = memDb.getMonthlyTrends(userId);

  return NextResponse.json({ data: { transactions, stats, categories, trends }, success: true });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const body: CreateTransactionPayload = await request.json();
    if (!body.title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });
    if (!body.amount || body.amount <= 0) return NextResponse.json({ error: "Valid amount required" }, { status: 400 });

    const transaction = memDb.create({ ...body, title: body.title.trim() }, userId);
    return NextResponse.json({ data: transaction, success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
