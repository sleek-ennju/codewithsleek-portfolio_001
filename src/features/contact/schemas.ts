import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100, "Keep your name under 100 characters."),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  message: z.string().trim().min(20, "Tell me a little more about what you want to build.").max(3000, "Keep your message under 3,000 characters."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export type ContactFormState = {
  status?: "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof ContactFormValues, string[]>>;
  values?: ContactFormValues;
  submissionId?: string;
};
