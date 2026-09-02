import { z } from "zod";

import { TECHNOLOGY_CATEGORIES } from "./library";

export const technologyFormSchema = z.object({
  name: z.string().trim().min(1, "Add a technology name.").max(60),
  category: z.enum(TECHNOLOGY_CATEGORIES, { message: "Choose one of the available categories." }),
  icon: z.string().trim().max(120),
});

export type TechnologyFormState = {
  message?: string;
  errors?: Record<string, string[]>;
  values?: { name: string; category: string; icon: string };
  submissionId?: string;
  tone?: "success" | "error";
};

export type TechnologySyncState = {
  message?: string;
  tone?: "success" | "error";
  submissionId?: string;
};
