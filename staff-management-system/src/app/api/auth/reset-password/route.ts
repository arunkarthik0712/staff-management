import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { updatePasswordByResetToken } from "@/lib/user-store";

export async function POST(req: Request) {
  const { email, token, password } = await req.json();

  if (!email || !token || !password) {
    return NextResponse.json({ message: "Missing data" }, { status: 400 });
  }

  const hashedPassword = await hash(password, 10);
  const result = await updatePasswordByResetToken({
    email,
    token,
    passwordHash: hashedPassword,
  });

  if (!result.ok && result.reason === "not_found") {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (!result.ok) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
  }

  return NextResponse.json({ message: "Password updated successfully" });
}
