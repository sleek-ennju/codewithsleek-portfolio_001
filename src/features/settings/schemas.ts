import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().url("Use a complete URL including https://")]);
export const siteSettingsSchema = z.object({
  brandName: z.string().trim().min(2).max(60), tagline: z.string().trim().min(2).max(100),
  heroTitle: z.string().trim().min(5).max(100), heroAccent: z.string().trim().min(2).max(60), heroDescription: z.string().trim().min(20).max(300),
  contactHeading: z.string().trim().min(5).max(120), contactDescription: z.string().trim().min(20).max(300), contactEmail: z.string().trim().email(), responseTime: z.string().trim().min(2).max(100),
  bookingUrl: optionalUrl, resumeUrl: optionalUrl, githubUrl: optionalUrl, linkedinUrl: optionalUrl, xUrl: optionalUrl,
  seoTitle: z.string().trim().min(5).max(70), seoDescription: z.string().trim().min(20).max(160),
});
export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type SiteSettingsState = { message?: string; errors?: Record<string, string[]>; values?: Record<string, string>; submissionId?: string };

export const defaultSiteSettings: SiteSettings = { brandName: "CODEwithSleek", tagline: "Crafting logic the sleek way", heroTitle: "Crafting logic,", heroAccent: "the sleek way.", heroDescription: "I design and engineer clear, scalable web products for ambitious teams—from the first product decision to the polished release.", contactHeading: "Have a product worth building properly?", contactDescription: "Share the challenge, the outcome you want, and where things currently stand. I’ll reply with a clear next step.", contactEmail: "codewithsleek@gmail.com", responseTime: "Usually within two business days.", bookingUrl: "", resumeUrl: "", githubUrl: "", linkedinUrl: "", xUrl: "", seoTitle: "Code with Sleek - Frontend-first full-stack engineering", seoDescription: "Premium web experiences, scalable product engineering, and evidence-backed case studies by Emmanuel Ihenacho." };
