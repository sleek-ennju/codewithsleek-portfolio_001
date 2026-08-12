import { z } from "zod";

export const testimonialFormSchema = z.object({
  authorName: z.string().trim().min(2, "Add the client's name.").max(100),
  authorRole: z.string().trim().min(2, "Add the client's role.").max(120),
  clientName: z.string().trim().min(2, "Add the company or client name.").max(120),
  quote: z.string().trim().min(20, "Use at least 20 characters for the testimonial.").max(1200),
  projectId: z.string().trim(), photoId: z.string().trim(),
  published: z.boolean(), featured: z.boolean(),
});

export type TestimonialFormState = { message?: string; errors?: Record<string, string[]>; values?: Record<string, string | boolean>; submissionId?: string };
