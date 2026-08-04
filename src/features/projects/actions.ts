"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { projectFormSchema, type ProjectFormSnapshot, type ProjectFormState } from "@/features/projects/schemas";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/server/db";
import { requireAdmin } from "@/server/permissions/require-admin";

function checkbox(formData: FormData, name: string) {
  return formData.get(name) === "on";
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
    seoDescription: String(formData.get("seoDescription") ?? ""), technologies: String(formData.get("technologies") ?? ""), metrics: String(formData.get("metrics") ?? ""),
    cardImageId: String(formData.get("cardImageId") ?? ""), coverImageId: String(formData.get("coverImageId") ?? ""),
    socialImageId: String(formData.get("socialImageId") ?? ""), galleryImageIds: formData.getAll("galleryImageIds").map(String),
  };
}

function parseProject(formData: FormData) {
  const values = snapshot(formData);
  return { values, parsed: projectFormSchema.safeParse(values) };
}

function projectData(data: ReturnType<typeof projectFormSchema.parse>, previousPublishedAt?: Date | null) {
  const { galleryImageIds, technologies, metrics, ...project } = data;
  void galleryImageIds; void technologies; void metrics;
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
  const ids = [...new Set([data.cardImageId, data.coverImageId, data.socialImageId, ...data.galleryImageIds].filter(Boolean))];
  if (ids.length === 0) return true;
  return (await getDb().mediaAsset.count({ where: { id: { in: ids } } })) === ids.length;
}

export async function createProject(_state: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const session = await requireAdmin();
  const { parsed, values } = parseProject(formData);
  if (!parsed.success) return { message: "Review the highlighted fields.", errors: parsed.error.flatten().fieldErrors, values, submissionId: crypto.randomUUID() };
  if (!(await mediaExists(parsed.data))) return { message: "One or more selected media assets no longer exist.", values, submissionId: crypto.randomUUID() };

  try {
    await getDb().$transaction(async (transaction) => {
      const project = await transaction.project.create({ data: projectData(parsed.data), select: { id: true } });
      if (parsed.data.galleryImageIds.length) await transaction.projectImage.createMany({ data: parsed.data.galleryImageIds.map((mediaId, position) => ({ projectId: project.id, mediaId, role: "gallery", position })) });
      await syncProjectDetails(transaction, project.id, parsed.data);
      await transaction.auditLog.create({ data: { actorId: session.user.id, action: "PROJECT_CREATED", entityType: "Project", entityId: project.id } });
    });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return { message: "That slug is already in use.", errors: { slug: ["Choose a unique slug."] }, values, submissionId: crypto.randomUUID() };
    throw error;
  }

  revalidatePath("/admin"); revalidatePath("/admin/projects"); revalidatePath("/projects"); revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProject(projectId: string, _state: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const session = await requireAdmin();
  const { parsed, values } = parseProject(formData);
  if (!parsed.success) return { message: "Review the highlighted fields.", errors: parsed.error.flatten().fieldErrors, values, submissionId: crypto.randomUUID() };
  if (!(await mediaExists(parsed.data))) return { message: "One or more selected media assets no longer exist.", values, submissionId: crypto.randomUUID() };

  const existing = await getDb().project.findUnique({ where: { id: projectId }, select: { publishedAt: true } });
  if (!existing) return { message: "This project no longer exists." };

  try {
    await getDb().$transaction(async (transaction) => {
      await transaction.project.update({ where: { id: projectId }, data: projectData(parsed.data, existing.publishedAt) });
      await transaction.projectImage.deleteMany({ where: { projectId, role: "gallery" } });
      if (parsed.data.galleryImageIds.length) await transaction.projectImage.createMany({ data: parsed.data.galleryImageIds.map((mediaId, position) => ({ projectId, mediaId, role: "gallery", position })) });
      await syncProjectDetails(transaction, projectId, parsed.data);
      await transaction.auditLog.create({ data: { actorId: session.user.id, action: "PROJECT_UPDATED", entityType: "Project", entityId: projectId, metadata: { status: parsed.data.status } } });
    });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return { message: "That slug is already in use.", errors: { slug: ["Choose a unique slug."] }, values, submissionId: crypto.randomUUID() };
    throw error;
  }

  revalidatePath("/admin"); revalidatePath("/admin/projects"); revalidatePath(`/admin/projects/${projectId}`); revalidatePath("/projects"); revalidatePath("/");
  redirect("/admin/projects");
}
