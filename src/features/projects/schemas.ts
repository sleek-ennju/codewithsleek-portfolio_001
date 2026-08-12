import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.url()]);

export const projectFormSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortSummary: z.string().trim().min(20).max(280),
  projectType: z.string().trim().min(2).max(80),
  industries: z.string().transform((value) => value.split(",").map((item) => item.trim()).filter(Boolean)).pipe(z.array(z.string().max(60)).max(8)),
  year: z.coerce.number().int().min(2000).max(2100),
  liveUrl: optionalUrl,
  demoUrl: optionalUrl,
  repositoryUrl: optionalUrl,
  repositoryVisible: z.boolean(),
  featured: z.boolean(),
  displayOrder: z.coerce.number().int().min(0).max(999),
  overview: z.string().trim().max(5000),
  problem: z.string().trim().max(5000),
  goals: z.string().trim().max(5000),
  role: z.string().trim().max(3000),
  approach: z.string().trim().max(5000),
  challenges: z.string().trim().max(5000),
  solutions: z.string().trim().max(5000),
  outcome: z.string().trim().max(5000),
  lessons: z.string().trim().max(5000),
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(160),
  technologies: z.string().transform((value) => [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))]).pipe(z.array(z.string().max(60)).max(20)),
  metrics: z.string().transform((value, context) => value.split("\n").map((line) => line.trim()).filter(Boolean).map((line, index) => {
    const [label = "", metricValue = "", unit = ""] = line.split("|").map((part) => part.trim());
    if (!label || !metricValue) context.addIssue({ code: "custom", message: `Metric line ${index + 1} must use Label | Value | Unit.` });
    return { label, value: metricValue, unit };
  })).pipe(z.array(z.object({ label: z.string().max(80), value: z.string().max(80), unit: z.string().max(40) })).max(12)),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  cardImageId: z.string(),
  coverImageId: z.string(),
  socialImageId: z.string(),
  galleryImageIds: z.array(z.string()).max(20),
}).superRefine((project, context) => {
  if (project.repositoryVisible && !project.repositoryUrl) {
    context.addIssue({ code: "custom", path: ["repositoryUrl"], message: "Add a repository URL before making it public." });
  }
  if (project.status === "PUBLISHED") {
    const required: Array<[keyof typeof project, string]> = [["overview", "Add an overview before publishing."], ["problem", "Describe the problem before publishing."], ["solutions", "Describe the solution before publishing."], ["outcome", "Describe the outcome before publishing."], ["cardImageId", "Choose a card image before publishing."], ["coverImageId", "Choose a cover image before publishing."]];
    for (const [path, message] of required) if (!project[path]) context.addIssue({ code: "custom", path: [path], message });
  }
});

export type ProjectFormState = {
  message?: string;
  errors?: Record<string, string[]>;
  values?: ProjectFormSnapshot;
  submissionId?: string;
};

export type ProjectFormSnapshot = {
  title: string; slug: string; shortSummary: string; projectType: string; industries: string; year: string;
  liveUrl: string; demoUrl: string; repositoryUrl: string; repositoryVisible: boolean; featured: boolean;
  displayOrder: string;
  overview: string; status: "DRAFT" | "PUBLISHED" | "ARCHIVED"; cardImageId: string; coverImageId: string;
  socialImageId: string; galleryImageIds: string[];
  problem: string; goals: string; role: string; approach: string; challenges: string; solutions: string;
  outcome: string; lessons: string; seoTitle: string; seoDescription: string; technologies: string; metrics: string;
};

export const projectSectionFormSchema = z.object({
  type: z.enum(["RICH_TEXT", "QUOTE", "CODE_SAMPLE", "TWO_COLUMN", "METRICS_GRID"]),
  title: z.string().trim().max(120),
  primary: z.string().trim().min(1, "Add section content.").max(12000),
  secondary: z.string().trim().max(12000),
}).superRefine((section, context) => {
  if (section.type === "TWO_COLUMN" && !section.secondary) context.addIssue({ code: "custom", path: ["secondary"], message: "Add content for the second column." });
  if (section.type === "METRICS_GRID") {
    section.primary.split("\n").map((line) => line.trim()).filter(Boolean).forEach((line, index) => {
      const [label, value] = line.split("|").map((part) => part.trim());
      if (!label || !value) context.addIssue({ code: "custom", path: ["primary"], message: `Metric line ${index + 1} must use Label | Value | Unit.` });
    });
  }
});

export type ProjectSectionFormState = { message?: string; errors?: Record<string, string[]>; values?: { type: string; title: string; primary: string; secondary: string }; submissionId?: string };
