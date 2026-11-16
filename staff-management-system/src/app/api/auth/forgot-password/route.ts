import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { sendMail } from "@/lib/mailer";
import { findUserByEmail, setResetToken } from "@/lib/user-store";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 10 * 60 * 1000);
  await setResetToken({ email, token, expiry });

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}&email=${email}`;

  const html = `
    <p style="color:#555;font-size:16px;">We received a request to reset your password. Click below to continue:</p>
    <a href="${resetLink}" style="display:inline-block;margin-top:20px;padding:12px 24px;background-color:#0f1e38;color:white;text-decoration:none;border-radius:6px;font-weight:bold;font-size:16px;">
      Reset Password
    </a>
    <p style="margin-top:30px;color:#888;font-size:14px;">If you did not request this, you can safely ignore this email.</p>
  `;

  await sendMail({
    to: email,
    subject: "Password Reset",
    html,
  });

  return NextResponse.json({
    message: "Reset link sent to your email. It is valid for 10 minutes.",
  });
}
