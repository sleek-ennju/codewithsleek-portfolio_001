import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" });
config();

const localGenerationUrl =
  "postgresql://codewithsleek:codewithsleek@localhost:5432/codewithsleek?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node node_modules/tsx/dist/cli.mjs prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? localGenerationUrl,
  },
});
