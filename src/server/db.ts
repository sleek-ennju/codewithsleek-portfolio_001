import { PrismaPg } from "@prisma/adapter-pg";

import { getServerEnv } from "@/config/env";
import { PrismaClient } from "@/generated/prisma/client";
import { normalizeDatabaseUrl } from "@/server/database-url";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const { DATABASE_URL } = getServerEnv();
  const adapter = new PrismaPg({ connectionString: normalizeDatabaseUrl(DATABASE_URL) });
  return new PrismaClient({ adapter });
}

export function getDb() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}
