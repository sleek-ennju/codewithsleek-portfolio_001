import { z } from "zod";

export const technologyFormSchema = z.object({
  name: z.string().trim().min(1, "Add a technology name.").max(60),
  category: z.string().trim().min(1, "Add a category.").max(60),
  icon: z.string().trim().max(120),
});

export type TechnologyFormState = {
  message?: string;
  errors?: Record<string, string[]>;
  values?: { name: string; category: string; icon: string };
  submissionId?: string;
};
