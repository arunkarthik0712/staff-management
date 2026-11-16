import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "@/lib/user-store";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 },
      );
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({
      email,
      name: email.split("@")[0],
      passwordHash: hashedPassword,
      scope: "platform",
      tenantId: null,
      tenantSlug: null,
    });

    return NextResponse.json(
      { message: "Platform user registered successfully!" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Platform Registration Error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}