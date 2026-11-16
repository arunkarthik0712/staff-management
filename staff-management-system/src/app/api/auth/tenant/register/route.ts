import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  findUserByEmailAndTenant,
  findTenantBySlug,
  createTenant,
  createUser,
} from "@/lib/user-store";

export async function POST(req: Request) {
  try {
    const { email, password, tenantSlug } = await req.json();

    if (!email || !password || !tenantSlug) {
      return NextResponse.json(
        { message: "Email, password, and tenantSlug are required." },
        { status: 400 },
      );
    }

    const tenant = await findTenantBySlug(tenantSlug);
    if (!tenant) {
      return NextResponse.json(
        { message: "Tenant not found." },
        { status: 404 },
      );
    }

    if (!tenant.active) {
      return NextResponse.json(
        { message: "Tenant pending activation. Please contact support." },
        { status: 403 },
      );
    }

    const existingUser = await findUserByEmailAndTenant(email, tenantSlug);
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered for this tenant." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({
      email,
      name: email.split("@")[0],
      passwordHash: hashedPassword,
      scope: "tenant",
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
    });

    return NextResponse.json(
      { message: "Tenant user registered successfully!" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Tenant Registration Error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}