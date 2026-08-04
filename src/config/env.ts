import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  AUTH_SECRET: z.string().min(32),
  ADMIN_EMAIL: z.string().email().transform((value) => value.toLowerCase()),
});

export function getServerEnv() {
  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const names = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Missing or invalid server environment variables: ${names}`);
  }

  return result.data;
}

const cloudinaryEnvSchema = z.object({
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
});

export function getCloudinaryEnv() {
  const result = cloudinaryEnvSchema.safeParse(process.env);
  if (!result.success) throw new Error("Cloudinary is not configured.");
  return result.data;
}
