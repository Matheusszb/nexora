import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/nexora",
  max: process.env.VERCEL ? 1 : 10
});
export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
