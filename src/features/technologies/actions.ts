"use server";

import { revalidatePath } from "next/cache";

import { technologyFormSchema, type TechnologyFormState } from "@/features/technologies/schemas";
import { getDb } from "@/server/db";
import { requireAdmin } from "@/server/permissions/require-admin";

function values(formData: FormData) {
  return { name: String(formData.get("name") ?? ""), category: String(formData.get("category") ?? ""), icon: String(formData.get("icon") ?? "") };
}

function slugify(name: string) {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function refreshTechnologyPaths() {
  revalidatePath("/admin/technologies");
  revalidatePath("/admin/projects/new");
  revalidatePath("/admin/projects/[projectId]", "page");
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/projects/[slug]", "page");
}

function fieldError(message: string, submitted: ReturnType<typeof values>): TechnologyFormState {
  return { message: "Review the highlighted fields.", errors: { name: [message] }, values: submitted, submissionId: crypto.randomUUID() };
}

export async function createTechnology(_state: TechnologyFormState, formData: FormData): Promise<TechnologyFormState> {
  const session = await requireAdmin();
  const submitted = values(formData);
  const parsed = technologyFormSchema.safeParse(submitted);
  if (!parsed.success) return { message: "Review the highlighted fields.", errors: parsed.error.flatten().fieldErrors, values: submitted, submissionId: crypto.randomUUID() };
  const slug = slugify(parsed.data.name);
  if (!slug) return fieldError("Use a name containing letters or numbers.", submitted);
  const duplicate = await getDb().technology.findFirst({ where: { OR: [{ name: { equals: parsed.data.name, mode: "insensitive" } }, { slug }] }, select: { id: true } });
  if (duplicate) return fieldError("That technology already exists.", submitted);
  const last = await getDb().technology.findFirst({ orderBy: { position: "desc" }, select: { position: true } });
  const technology = await getDb().$transaction(async (transaction) => {
    const created = await transaction.technology.create({ data: { ...parsed.data, icon: parsed.data.icon || null, slug, position: (last?.position ?? -1) + 1 } });
    await transaction.auditLog.create({ data: { actorId: session.user.id, action: "TECHNOLOGY_CREATED", entityType: "Technology", entityId: created.id, metadata: { name: created.name } } });
    return created;
  });
  refreshTechnologyPaths();
  return { message: `${technology.name} added.`, submissionId: crypto.randomUUID() };
}

export async function updateTechnology(id: string, _state: TechnologyFormState, formData: FormData): Promise<TechnologyFormState> {
  const session = await requireAdmin();
  const submitted = values(formData);
  const parsed = technologyFormSchema.safeParse(submitted);
  if (!parsed.success) return { message: "Review the highlighted fields.", errors: parsed.error.flatten().fieldErrors, values: submitted, submissionId: crypto.randomUUID() };
  const slug = slugify(parsed.data.name);
  if (!slug) return fieldError("Use a name containing letters or numbers.", submitted);
  const duplicate = await getDb().technology.findFirst({ where: { id: { not: id }, OR: [{ name: { equals: parsed.data.name, mode: "insensitive" } }, { slug }] }, select: { id: true } });
  if (duplicate) return fieldError("That technology already exists.", submitted);
  const existing = await getDb().technology.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return { message: "This technology no longer exists." };
  await getDb().$transaction([
    getDb().technology.update({ where: { id }, data: { ...parsed.data, icon: parsed.data.icon || null, slug } }),
    getDb().auditLog.create({ data: { actorId: session.user.id, action: "TECHNOLOGY_UPDATED", entityType: "Technology", entityId: id, metadata: { name: parsed.data.name } } }),
  ]);
  refreshTechnologyPaths();
  return { message: "Technology updated.", submissionId: crypto.randomUUID() };
}

export async function moveTechnology(id: string, direction: "up" | "down") {
  await requireAdmin();
  const technologies = await getDb().technology.findMany({ orderBy: [{ position: "asc" }, { name: "asc" }], select: { id: true, position: true } });
  const index = technologies.findIndex((technology) => technology.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= technologies.length) return;
  const reordered = [...technologies];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
  await getDb().$transaction(reordered.map((technology, position) => getDb().technology.update({ where: { id: technology.id }, data: { position } })));
  refreshTechnologyPaths();
}

export async function deleteTechnology(id: string, _state: TechnologyFormState): Promise<TechnologyFormState> {
  void _state;
  const session = await requireAdmin();
  const technology = await getDb().technology.findUnique({ where: { id }, select: { name: true, _count: { select: { projects: true } } } });
  if (!technology) return { message: "This technology no longer exists." };
  if (technology._count.projects) return { message: `Remove ${technology.name} from ${technology._count.projects} project${technology._count.projects === 1 ? "" : "s"} before deleting it.`, errors: { name: ["Technology is still in use."] } };
  await getDb().$transaction([
    getDb().technology.delete({ where: { id } }),
    getDb().auditLog.create({ data: { actorId: session.user.id, action: "TECHNOLOGY_DELETED", entityType: "Technology", entityId: id, metadata: { name: technology.name } } }),
  ]);
  refreshTechnologyPaths();
  return { message: `${technology.name} removed.`, submissionId: crypto.randomUUID() };
}
