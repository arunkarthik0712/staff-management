import { connectToDatabase } from "./db/connection";
import { UserModel } from "@/models";
import { getMongoTenantModel } from "./db/mongo";

export type AuthUser = {
  id: string | number;
  email: string;
  name: string;
  password: string;
  scope?: string;
  tenantId?: number | string | null;
  tenantSlug?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | string | null;
};

export type Tenant = {
  id: string | number;
  slug: string;
  name: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function normalizeUser(raw: any): AuthUser | null {
  if (!raw) return null;
  return {
    id: raw._id ? String(raw._id) : raw.id,
    email: raw.email,
    name: raw.sname || raw.uname || raw.name || raw.email,
    password: raw.password,
    scope: raw.scope ?? "staff",
    tenantId: raw.tenantId ?? null,
    tenantSlug: raw.tenantSlug ?? null,
    resetToken: raw.resetToken ?? null,
    resetTokenExpiry: raw.resetTokenExpiry ?? null,
  };
}

function normalizeTenant(raw: any): Tenant | null {
  if (!raw) return null;
  return {
    id: raw._id ? String(raw._id) : raw.id,
    slug: raw.slug,
    name: raw.name ?? null,
    active: Boolean(raw.active),
    createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date(),
  };
}

export async function findTenantBySlug(slug: string): Promise<Tenant | null> {
  const Tenant = await getMongoTenantModel();
  const tenant = await Tenant.findOne({ slug }).lean();
  return normalizeTenant(tenant);
}

export async function createTenant({
  slug,
  name,
}: {
  slug: string;
  name?: string;
}): Promise<Tenant> {
  const Tenant = await getMongoTenantModel();
  const tenant = await Tenant.create({ slug, name, active: false });
  return {
    id: String(tenant._id),
    slug: tenant.slug,
    name: tenant.name ?? null,
    active: tenant.active,
    createdAt: tenant.createdAt,
    updatedAt: tenant.updatedAt,
  };
}

export async function activateTenant(slug: string): Promise<void> {
  const Tenant = await getMongoTenantModel();
  await Tenant.updateOne({ slug }, { $set: { active: true } });
}

export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  await connectToDatabase();
  const user = await UserModel.findOne({ email: email.toLowerCase().trim() }).lean();
  return normalizeUser(user);
}

export async function findUserByEmailAndTenant(
  email: string,
  tenantSlug: string,
): Promise<AuthUser | null> {
  await connectToDatabase();
  const user = await UserModel.findOne({ email: email.toLowerCase().trim(), tenantSlug }).lean();
  return normalizeUser(user);
}

export async function createUser({
  email,
  name,
  passwordHash,
  scope = "staff",
  tenantId,
  tenantSlug,
}: {
  email: string;
  name: string;
  passwordHash: string;
  scope?: string;
  tenantId?: number | string | null;
  tenantSlug?: string | null;
}) {
  await connectToDatabase();
  const highestUser = await UserModel.findOne().sort({ user_id: -1 }).select("user_id").lean();
  const nextId = (highestUser?.user_id || 0) + 1;

  const user = await UserModel.create({
    user_id: nextId,
    email: email.toLowerCase().trim(),
    sname: name,
    uname: name,
    password: passwordHash,
    scope,
    department: "Computer Applications",
    designation: "Assistant Professor",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return normalizeUser(user);
}

export async function setResetToken({
  email,
  token,
  expiry,
}: {
  email: string;
  token: string;
  expiry: Date;
}) {
  await connectToDatabase();
  await UserModel.updateOne(
    { email: email.toLowerCase().trim() },
    { $set: { resetToken: token, resetTokenExpiry: expiry } },
  );
}

export async function updatePasswordByResetToken({
  email,
  token,
  passwordHash,
}: {
  email: string;
  token: string;
  passwordHash: string;
}) {
  const user = await findUserByEmail(email);
  if (!user) return { ok: false as const, reason: "not_found" as const };

  const expiry = user.resetTokenExpiry ? new Date(user.resetTokenExpiry) : null;
  const expired = !expiry || expiry < new Date();
  if (user.resetToken !== token || expired) {
    return { ok: false as const, reason: "invalid_or_expired_token" as const };
  }

  await connectToDatabase();
  await UserModel.updateOne(
    { email: email.toLowerCase().trim() },
    {
      $set: { password: passwordHash },
      $unset: { resetToken: "", resetTokenExpiry: "" },
    },
  );
  return { ok: true as const };
}
