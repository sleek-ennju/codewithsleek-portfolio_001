import { z } from "zod";

const siteUrlSchema = z.string().url();

const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;
const parsedSiteUrl = siteUrlSchema.safeParse(
  process.env.NEXT_PUBLIC_SITE_URL ?? vercelProductionUrl ?? "http://localhost:3000",
);

if (!parsedSiteUrl.success) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be a valid absolute URL.");
}

export const siteConfig = {
  name: "Code with Sleek",
  title: "Code with Sleek - Frontend-first full-stack engineering",
  description:
    "Premium web experiences, scalable product engineering, and evidence-backed case studies by Emmanuel Ihenacho.",
  url: parsedSiteUrl.data,
  navigation: [
    { label: "Works", href: "/#works" },
    { label: "Process", href: "/#process" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;
