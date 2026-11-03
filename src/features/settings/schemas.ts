import { z } from "zod";

const optionalUrl = z.union([
  z.literal(""),
  z.string().url("Use a complete URL including https://"),
]);
export const siteSettingsSchema = z.object({
  brandName: z.string().trim().min(2).max(60),
  tagline: z.string().trim().min(2).max(100),
  heroTitle: z.string().trim().min(5).max(100),
  heroAccent: z.string().trim().min(2).max(60),
  heroDescription: z.string().trim().min(20).max(300),
  contactHeading: z.string().trim().min(5).max(120),
  contactDescription: z.string().trim().min(20).max(300),
  contactEmail: z.string().trim().email(),
  responseTime: z.string().trim().min(2).max(100),
  bookingUrl: optionalUrl,
  resumeUrl: optionalUrl,
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  xUrl: optionalUrl,
  seoTitle: z.string().trim().min(5).max(70),
  seoDescription: z.string().trim().min(20).max(160),
});
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type SiteSettingsState = {
  message?: string;
  errors?: Record<string, string[]>;
  values?: Record<string, string>;
  submissionId?: string;
};

export const defaultSiteSettings: SiteSettings = {
  brandName: "CODEwithSleek",
  tagline: "Websites & digital systems",
  heroTitle: "Turn attention",
  heroAccent: "into customers.",
  heroDescription:
    "We design and build websites, booking and payment flows, automations and custom software for growing businesses. Every project is measured, not guessed.",
  contactHeading: "Want to know what your website is costing you?",
  contactDescription:
    "Tell us about your business and where things stand. We’ll send a free audit of your site with the three changes that matter most. No obligation.",
  contactEmail: "hello@codewithsleek.com",
  responseTime: "Usually within two business days.",
  bookingUrl: "",
  resumeUrl: "",
  githubUrl: "",
  linkedinUrl: "",
  xUrl: "",
  seoTitle: "Websites & digital systems for growing businesses",
  seoDescription:
    "Websites, booking systems, automations and custom software that turn attention into customers. Measured results for growing UK businesses.",
};
