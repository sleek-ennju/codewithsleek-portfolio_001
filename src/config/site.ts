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
  name: "CodeWithSleek",
  title: "CodeWithSleek - Websites and digital systems for growing businesses",
  description:
    "We build websites, booking and payment flows, automations and custom software that turn attention into customers. Measured, not guessed.",
  url: parsedSiteUrl.data,
  resumePath: "/documents/Emmanuel-Ihenacho-Resume.pdf",
  navigation: [
    { label: "Work", href: "/#works" },
    { label: "Process", href: "/#process" },
    { label: "Services", href: "/#services" },
    { label: "Founder", href: "/founder" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;
