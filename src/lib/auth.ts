import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { db } from "./db";

const cookieName = "nexora_admin";
const days = 7;
const hash = (token: string) => createHash("sha256").update(token).digest("hex");

export async function getAdmin() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  const session = await db.adminSession.findUnique({ where: { tokenHash: hash(token) }, include: { admin: true } });
  if (!session || session.expiresAt < new Date() || !session.admin.active) return null;
  return session.admin;
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/entrar");
  return admin;
}

export async function createSession(adminId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + days * 86400000);
  await db.adminSession.create({ data: { adminId, tokenHash: hash(token), expiresAt } });
  (await cookies()).set(cookieName, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires: expiresAt
  });
}

export async function clearSession() {
  const token = (await cookies()).get(cookieName)?.value;
  if (token) await db.adminSession.deleteMany({ where: { tokenHash: hash(token) } });
  (await cookies()).delete(cookieName);
}
