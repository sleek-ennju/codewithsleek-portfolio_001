import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local" });
config();

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

const starterSlugs = [
  "routepilot-logistics-control-center",
  "carepath-clinic-operations",
  "ledgerly-cashflow-intelligence",
  "skillspring-cohort-learning",
  "verdant-sustainable-commerce",
];

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

try {
  await prisma.project.updateMany({
    where: { slug: "slug" },
    data: { featured: false },
  });
  await prisma.project.updateMany({
    where: { slug: { in: starterSlugs }, status: "PUBLISHED" },
    data: { featured: true },
  });

  const featured = await prisma.project.findMany({
    where: { slug: { in: starterSlugs }, featured: true, status: "PUBLISHED" },
    select: { slug: true },
  });

  if (featured.length !== starterSlugs.length) {
    throw new Error("The starter homepage curation could not be verified.");
  }

  console.log("Verified five featured starter case studies.");
} finally {
  await prisma.$disconnect();
}
