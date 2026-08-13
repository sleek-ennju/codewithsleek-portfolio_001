import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local" });
config();

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const demos = [
  {
    authorName: "Maya Chen",
    authorRole: "Product Lead (Demo)",
    clientName: "Northstar Labs (Demo)",
    quote: "The strongest part of the collaboration was the clarity. Complex product decisions became a focused interface, and every detail felt connected to what users actually needed to do next.",
    projectSlug: "routepilot-logistics-control-center",
  },
  {
    authorName: "David Okafor",
    authorRole: "Operations Director (Demo)",
    clientName: "Fieldwork Systems (Demo)",
    quote: "We moved from scattered ideas to a product story the whole team could understand. The experience felt considered, fast, and genuinely ready for the conversations that followed.",
    projectSlug: "carepath-clinic-operations",
  },
] as const;

try {
  const last = await prisma.testimonial.findFirst({ orderBy: { displayOrder: "desc" }, select: { displayOrder: true } });
  for (const [offset, demo] of demos.entries()) {
    const [client, project, existing] = await Promise.all([
      prisma.client.upsert({ where: { name: demo.clientName }, update: {}, create: { name: demo.clientName } }),
      prisma.project.findUnique({ where: { slug: demo.projectSlug }, select: { id: true } }),
      prisma.testimonial.findFirst({ where: { authorName: demo.authorName, authorRole: demo.authorRole }, select: { id: true } }),
    ]);
    const data = { authorName: demo.authorName, authorRole: demo.authorRole, quote: demo.quote, clientId: client.id, projectId: project?.id ?? null, published: true, featured: true };
    if (existing) await prisma.testimonial.update({ where: { id: existing.id }, data });
    else await prisma.testimonial.create({ data: { ...data, displayOrder: (last?.displayOrder ?? -1) + offset + 1 } });
    console.log(`${existing ? "Updated" : "Created"} removable demo testimonial: ${demo.authorName}`);
  }
} finally {
  await prisma.$disconnect();
}
