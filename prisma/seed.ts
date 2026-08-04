import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local" });
config();

const databaseUrl = process.env.DATABASE_URL;
const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

if (!databaseUrl || !adminEmail || !adminPasswordHash) {
  throw new Error(
    "DATABASE_URL, ADMIN_EMAIL, and ADMIN_PASSWORD_HASH are required to seed the administrator.",
  );
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

await prisma.user.upsert({
  where: { email: adminEmail },
  update: {
    active: true,
    name: "Emmanuel Ihenacho",
    passwordHash: adminPasswordHash,
  },
  create: {
    email: adminEmail,
    name: "Emmanuel Ihenacho",
    passwordHash: adminPasswordHash,
  },
});

const activeAdministratorCount = await prisma.user.count({
  where: {
    email: adminEmail,
    active: true,
  },
});

if (activeAdministratorCount !== 1) {
  throw new Error("The administrator seed could not be verified.");
}

await prisma.$disconnect();
