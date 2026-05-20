import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });

    if (password.length < 6)
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ data: user, success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
