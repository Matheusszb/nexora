import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!email || !password || password.length < 12) {
  console.error("Defina ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 12 caracteres) em um ambiente seguro.");
  process.exit(1);
}

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL! }) });
try {
  const passwordHash = await bcrypt.hash(password, 12);
  await db.admin.upsert({ where: { email }, create: { email, passwordHash }, update: { passwordHash, active: true } });
  console.log(`Administrador ${email} criado ou atualizado.`);
} finally { await db.$disconnect(); }
