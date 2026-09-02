import { describe, expect, it } from "vitest";

import { projectFormSchema, projectSectionFormSchema } from "../../src/features/projects/schemas";

const validProject = {
  title: "Portfolio platform",
  slug: "portfolio-platform",
  shortSummary: "A structured portfolio platform built for measurable case studies.",
  projectType: "Web application",
  industries: "Technology, Creative services",
  year: 2026,
  liveUrl: "",
  demoUrl: "",
  repositoryUrl: "https://github.com/example/private-project",
  repositoryVisible: false,
  featured: false,
  displayOrder: 0,
  overview: "",
  problem: "",
  goals: "",
  role: "",
  approach: "",
  challenges: "",
  solutions: "",
  outcome: "",
  lessons: "",
  seoTitle: "",
  seoDescription: "",
  technologies: "Next.js, PostgreSQL",
  metrics: "Performance score | 98 | /100",
  status: "DRAFT",
  cardImageId: "",
  coverImageId: "",
  socialImageId: "",
  storyOverviewImageId: "",
  storyFeatureImageId: "",
  storyDetailImageId: "",
  galleryImageIds: [],
};

describe("projectFormSchema", () => {
  it("accepts a stored private repository", () => {
    expect(projectFormSchema.safeParse(validProject).success).toBe(true);
  });

  it("requires a repository URL before public visibility", () => {
    const result = projectFormSchema.safeParse({
      ...validProject,
      repositoryUrl: "",
      repositoryVisible: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects unsafe slugs", () => {
    const result = projectFormSchema.safeParse({ ...validProject, slug: "Not A Slug" });
    expect(result.success).toBe(false);
  });

  it("blocks incomplete projects from publishing", () => {
    const result = projectFormSchema.safeParse({ ...validProject, status: "PUBLISHED" });
    expect(result.success).toBe(false);
  });

  it("requires structured metric lines", () => {
    const result = projectFormSchema.safeParse({
      ...validProject,
      metrics: "Performance score only",
    });
    expect(result.success).toBe(false);
  });
});

describe("projectSectionFormSchema", () => {
  it("accepts a rich text content block", () => {
    const result = projectSectionFormSchema.safeParse({
      type: "RICH_TEXT",
      title: "The approach",
      primary: "A focused delivery narrative.",
      secondary: "",
    });
    expect(result.success).toBe(true);
  });

  it("requires content for both columns", () => {
    const result = projectSectionFormSchema.safeParse({
      type: "TWO_COLUMN",
      title: "Comparison",
      primary: "Before",
      secondary: "",
    });
    expect(result.success).toBe(false);
  });

  it("requires structured metric rows", () => {
    const result = projectSectionFormSchema.safeParse({
      type: "METRICS_GRID",
      title: "Results",
      primary: "Performance score only",
      secondary: "",
    });
    expect(result.success).toBe(false);
  });
});
