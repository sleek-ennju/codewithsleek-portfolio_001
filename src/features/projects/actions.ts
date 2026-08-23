"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { projectFormSchema, projectSectionFormSchema, type ProjectFormSnapshot, type ProjectFormState, type ProjectSectionFormState } from "@/features/projects/schemas";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/server/db";
import { requireAdmin } from "@/server/permissions/require-admin";

function checkbox(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function isDatabaseUnavailable(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error && typeof error.code === "string" ? error.code : "";
  const message = "message" in error && typeof error.message === "string" ? error.message : "";
  return ["P1001", "P1002", "P1017"].includes(code) || /can't reach database server|connection (?:closed|refused|timed out)|ECONNREFUSED|ETIMEDOUT/i.test(message);
}

function databaseUnavailableState(values: ProjectFormSnapshot): ProjectFormState {
  return { message: "The database is temporarily unavailable. Your form values are still here—please check your connection and try saving again.", values, submissionId: crypto.randomUUID() };
}

function snapshot(formData: FormData): ProjectFormSnapshot {
  const status = String(formData.get("status"));
  return {
    title: String(formData.get("title") ?? ""), slug: String(formData.get("slug") ?? ""), shortSummary: String(formData.get("shortSummary") ?? ""),
    projectType: String(formData.get("projectType") ?? ""), industries: String(formData.get("industries") ?? ""), year: String(formData.get("year") ?? ""),
    liveUrl: String(formData.get("liveUrl") ?? ""), demoUrl: String(formData.get("demoUrl") ?? ""), repositoryUrl: String(formData.get("repositoryUrl") ?? ""),
    repositoryVisible: checkbox(formData, "repositoryVisible"), featured: checkbox(formData, "featured"),
    displayOrder: String(formData.get("displayOrder") ?? "0"),
    overview: String(formData.get("overview") ?? ""), status: status === "PUBLISHED" || status === "ARCHIVED" ? status : "DRAFT",
    problem: String(formData.get("problem") ?? ""), goals: String(formData.get("goals") ?? ""), role: String(formData.get("role") ?? ""),
    approach: String(formData.get("approach") ?? ""), challenges: String(formData.get("challenges") ?? ""), solutions: String(formData.get("solutions") ?? ""),
    outcome: String(formData.get("outcome") ?? ""), lessons: String(formData.get("lessons") ?? ""), seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""), technologies: formData.getAll("technologies").map(String).join(", "), metrics: String(formData.get("metrics") ?? ""),
    cardImageId: String(formData.get("cardImageId") ?? ""), coverImageId: String(formData.get("coverImageId") ?? ""),
    socialImageId: String(formData.get("socialImageId") ?? ""),
    storyOverviewImageId: String(formData.get("storyOverviewImageId") ?? ""), storyFeatureImageId: String(formData.get("storyFeatureImageId") ?? ""),
    storyDetailImageId: String(formData.get("storyDetailImageId") ?? ""), galleryImageIds: formData.getAll("galleryImageIds").map(String),
  };
}

function parseProject(formData: FormData) {
  const values = snapshot(formData);
  return { values, parsed: projectFormSchema.safeParse(values) };
}

function projectData(data: ReturnType<typeof projectFormSchema.parse>, previousPublishedAt?: Date | null) {
  const { galleryImageIds, storyOverviewImageId, storyFeatureImageId, storyDetailImageId, technologies, metrics, ...project } = data;
  void galleryImageIds; void storyOverviewImageId; void storyFeatureImageId; void storyDetailImageId; void technologies; void metrics;
  return {
    ...project,
    liveUrl: data.liveUrl || null,
    demoUrl: data.demoUrl || null,
    repositoryUrl: data.repositoryUrl || null,
    repositoryVisible: Boolean(data.repositoryUrl && data.repositoryVisible),
    overview: data.overview || null,
    problem: data.problem || null, goals: data.goals || null, role: data.role || null, approach: data.approach || null,
    challenges: data.challenges || null, solutions: data.solutions || null, outcome: data.outcome || null, lessons: data.lessons || null,
    seoTitle: data.seoTitle || null, seoDescription: data.seoDescription || null,
    cardImageId: data.cardImageId || null,
    coverImageId: data.coverImageId || null,
    socialImageId: data.socialImageId || null,
    publishedAt: data.status === "PUBLISHED" ? (previousPublishedAt ?? new Date()) : null,
  };
}

function technologySlug(name: string) {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function syncProjectDetails(transaction: Prisma.TransactionClient, projectId: string, data: ReturnType<typeof projectFormSchema.parse>) {
  await transaction.projectTechnology.deleteMany({ where: { projectId } });
  for (const [position, name] of data.technologies.entries()) {
    const technology = await transaction.technology.upsert({ where: { name }, update: {}, create: { name, slug: technologySlug(name), category: "General" }, select: { id: true } });
    await transaction.projectTechnology.create({ data: { projectId, technologyId: technology.id, category: "General", position } });
  }
  await transaction.projectMetric.deleteMany({ where: { projectId } });
  if (data.metrics.length) await transaction.projectMetric.createMany({ data: data.metrics.map((metric, position) => ({ projectId, label: metric.label, value: metric.value, unit: metric.unit || null, position })) });
}

async function mediaExists(data: ReturnType<typeof projectFormSchema.parse>) {
  const ids = [...new Set([data.cardImageId, data.coverImageId, data.socialImageId, data.storyOverviewImageId, data.storyFeatureImageId, data.storyDetailImageId, ...data.galleryImageIds].filter(Boolean))];
  if (ids.length === 0) return true;
  return (await getDb().mediaAsset.count({ where: { id: { in: ids } } })) === ids.length;
}

async function syncProjectImages(transaction: Prisma.TransactionClient, projectId: string, data: ReturnType<typeof projectFormSchema.parse>) {
  await transaction.projectImage.deleteMany({ where: { projectId, role: { in: ["gallery", "story"] } } });
  const storyImageIds = [data.storyOverviewImageId, data.storyFeatureImageId, data.storyDetailImageId];
  const storyImages = storyImageIds.flatMap((mediaId, position) => mediaId ? [{ projectId, mediaId, role: "story", position }] : []);
  const galleryImages = data.galleryImageIds.map((mediaId, position) => ({ projectId, mediaId, role: "gallery", position }));
  if (storyImages.length || galleryImages.length) await transaction.projectImage.createMany({ data: [...storyImages, ...galleryImages] });
}

export async function createProject(_state: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const session = await requireAdmin();
  const { parsed, values } = parseProject(formData);
  if (!parsed.success) return { message: "Review the highlighted fields.", errors: parsed.error.flatten().fieldErrors, values, submissionId: crypto.randomUUID() };

  try {
    if (!(await mediaExists(parsed.data))) return { message: "One or more selected media assets no longer exist.", values, submissionId: crypto.randomUUID() };
    await getDb().$transaction(async (transaction) => {
      const project = await transaction.project.create({ data: projectData(parsed.data), select: { id: true } });
      await syncProjectImages(transaction, project.id, parsed.data);
      await syncProjectDetails(transaction, project.id, parsed.data);
      await transaction.auditLog.create({ data: { actorId: session.user.id, action: "PROJECT_CREATED", entityType: "Project", entityId: project.id } });
    });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return { message: "That slug is already in use.", errors: { slug: ["Choose a unique slug."] }, values, submissionId: crypto.randomUUID() };
    if (isDatabaseUnavailable(error)) {
      console.error("[projects:create] Database unavailable", { code: "code" in (error as object) ? (error as { code?: unknown }).code : undefined });
      return databaseUnavailableState(values);
    }
    throw error;
  }

  revalidatePath("/admin"); revalidatePath("/admin/projects"); revalidatePath("/projects"); revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProject(projectId: string, _state: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const session = await requireAdmin();
  const { parsed, values } = parseProject(formData);
  if (!parsed.success) return { message: "Review the highlighted fields.", errors: parsed.error.flatten().fieldErrors, values, submissionId: crypto.randomUUID() };

  try {
    if (!(await mediaExists(parsed.data))) return { message: "One or more selected media assets no longer exist.", values, submissionId: crypto.randomUUID() };
    const existing = await getDb().project.findUnique({ where: { id: projectId }, select: { publishedAt: true } });
    if (!existing) return { message: "This project no longer exists." };
    await getDb().$transaction(async (transaction) => {
      await transaction.project.update({ where: { id: projectId }, data: projectData(parsed.data, existing.publishedAt) });
      await syncProjectImages(transaction, projectId, parsed.data);
      await syncProjectDetails(transaction, projectId, parsed.data);
      await transaction.auditLog.create({ data: { actorId: session.user.id, action: "PROJECT_UPDATED", entityType: "Project", entityId: projectId, metadata: { status: parsed.data.status } } });
    });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return { message: "That slug is already in use.", errors: { slug: ["Choose a unique slug."] }, values, submissionId: crypto.randomUUID() };
    if (isDatabaseUnavailable(error)) {
      console.error("[projects:update] Database unavailable", { projectId, code: "code" in (error as object) ? (error as { code?: unknown }).code : undefined });
      return databaseUnavailableState(values);
    }
    throw error;
  }

  revalidatePath("/admin"); revalidatePath("/admin/projects"); revalidatePath(`/admin/projects/${projectId}`); revalidatePath("/projects"); revalidatePath("/");
  redirect("/admin/projects");
}

function sectionSnapshot(formData: FormData) {
  return { type: String(formData.get("type") ?? "RICH_TEXT"), title: String(formData.get("title") ?? ""), primary: String(formData.get("primary") ?? ""), secondary: String(formData.get("secondary") ?? "") };
}

function sectionContent(data: ReturnType<typeof projectSectionFormSchema.parse>): Prisma.InputJsonValue {
  if (data.type === "TWO_COLUMN") return { left: data.primary, right: data.secondary };
  if (data.type === "QUOTE") return { quote: data.primary, attribution: data.secondary };
  if (data.type === "CODE_SAMPLE") return { code: data.primary, language: data.secondary || "text" };
  if (data.type === "METRICS_GRID") return { metrics: data.primary.split("\n").map((line) => { const [label, value, unit = ""] = line.split("|").map((part) => part.trim()); return { label, value, unit }; }) };
  return { text: data.primary };
}

function revalidateProjectSectionPaths(projectId: string, slug?: string) {
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath(`/admin/projects/${projectId}/preview`);
  if (slug) revalidatePath(`/projects/${slug}`);
}

export async function createProjectSection(projectId: string, _state: ProjectSectionFormState, formData: FormData): Promise<ProjectSectionFormState> {
  const session = await requireAdmin();
  const values = sectionSnapshot(formData);
  const parsed = projectSectionFormSchema.safeParse(values);
  if (!parsed.success) return { message: "Review the highlighted section fields.", errors: parsed.error.flatten().fieldErrors, values, submissionId: crypto.randomUUID() };
  const project = await getDb().project.findUnique({ where: { id: projectId }, select: { slug: true, sections: { select: { position: true }, orderBy: { position: "desc" }, take: 1 } } });
  if (!project) return { message: "This project no longer exists." };
  await getDb().$transaction(async (transaction) => {
    const section = await transaction.projectSection.create({ data: { projectId, type: parsed.data.type, title: parsed.data.title || null, content: sectionContent(parsed.data), position: (project.sections[0]?.position ?? -1) + 1 } });
    await transaction.auditLog.create({ data: { actorId: session.user.id, action: "PROJECT_SECTION_CREATED", entityType: "ProjectSection", entityId: section.id, metadata: { projectId, type: parsed.data.type } } });
  });
  revalidateProjectSectionPaths(projectId, project.slug);
  return { message: "Section added.", submissionId: crypto.randomUUID() };
}

export async function updateProjectSection(projectId: string, sectionId: string, _state: ProjectSectionFormState, formData: FormData): Promise<ProjectSectionFormState> {
  const session = await requireAdmin();
  const values = sectionSnapshot(formData);
  const parsed = projectSectionFormSchema.safeParse(values);
  if (!parsed.success) return { message: "Review the highlighted section fields.", errors: parsed.error.flatten().fieldErrors, values, submissionId: crypto.randomUUID() };
  const section = await getDb().projectSection.findFirst({ where: { id: sectionId, projectId }, select: { project: { select: { slug: true } } } });
  if (!section) return { message: "This section no longer exists." };
  await getDb().$transaction([
    getDb().projectSection.update({ where: { id: sectionId }, data: { type: parsed.data.type, title: parsed.data.title || null, content: sectionContent(parsed.data) } }),
    getDb().auditLog.create({ data: { actorId: session.user.id, action: "PROJECT_SECTION_UPDATED", entityType: "ProjectSection", entityId: sectionId, metadata: { projectId, type: parsed.data.type } } }),
  ]);
  revalidateProjectSectionPaths(projectId, section.project.slug);
  return { message: "Section updated.", submissionId: crypto.randomUUID() };
}

export async function moveProjectSection(projectId: string, sectionId: string, direction: "up" | "down") {
  await requireAdmin();
  const sections = await getDb().projectSection.findMany({ where: { projectId }, orderBy: { position: "asc" }, select: { id: true } });
  const index = sections.findIndex((section) => section.id === sectionId);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= sections.length) return;
  const reordered = [...sections];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
  await getDb().$transaction(async (transaction) => {
    for (const [position, section] of reordered.entries()) await transaction.projectSection.update({ where: { id: section.id }, data: { position: -(position + 1) } });
    for (const [position, section] of reordered.entries()) await transaction.projectSection.update({ where: { id: section.id }, data: { position } });
  });
  const project = await getDb().project.findUnique({ where: { id: projectId }, select: { slug: true } });
  revalidateProjectSectionPaths(projectId, project?.slug);
}

export async function deleteProjectSection(projectId: string, sectionId: string) {
  const session = await requireAdmin();
  const section = await getDb().projectSection.findFirst({ where: { id: sectionId, projectId }, select: { project: { select: { slug: true } } } });
  if (!section) return;
  await getDb().$transaction([
    getDb().projectSection.delete({ where: { id: sectionId } }),
    getDb().auditLog.create({ data: { actorId: session.user.id, action: "PROJECT_SECTION_DELETED", entityType: "ProjectSection", entityId: sectionId, metadata: { projectId } } }),
  ]);
  const remaining = await getDb().projectSection.findMany({ where: { projectId }, orderBy: { position: "asc" }, select: { id: true } });
  await getDb().$transaction(remaining.map((item, position) => getDb().projectSection.update({ where: { id: item.id }, data: { position } })));
  revalidateProjectSectionPaths(projectId, section.project.slug);
}
