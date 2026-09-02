import { z } from "zod";

export const auditRequestSchema = z.object({
  projectId: z.string().min(1, "Choose a project."),
  testedUrl: z
    .string()
    .trim()
    .url("Enter a complete public URL.")
    .refine((value) => {
      const protocol = new URL(value).protocol;
      return protocol === "http:" || protocol === "https:";
    }, "Only HTTP and HTTPS URLs can be audited."),
  strategy: z.enum(["MOBILE", "DESKTOP"]),
});

export type AuditFormValues = z.infer<typeof auditRequestSchema>;
export type AuditFormState = {
  status?: "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof AuditFormValues, string[]>>;
  values?: AuditFormValues;
  submissionId?: string;
};
