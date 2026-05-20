import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name?.trim())     return NextResponse.json({ error: "Name is required" },     { status: 400 });
    if (!email?.trim())    return NextResponse.json({ error: "Email is required" },    { status: 400 });
    if (!password || password.length < 8)
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    // Hash password and create user
    const hashed = await bcrypt.hash(password, 10);
    const user   = await prisma.user.create({
      data: { name: name.trim(), email: email.trim().toLowerCase(), password: hashed },
    });

    return NextResponse.json(
      { data: { id: user.id, name: user.name, email: user.email }, success: true },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}