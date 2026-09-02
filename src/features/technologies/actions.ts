"use server";

import { revalidatePath } from "next/cache";

import { TECHNOLOGY_LIBRARY, technologySlug } from "@/features/technologies/library";
import {
  technologyFormSchema,
  type TechnologyFormState,
  type TechnologySyncState,
} from "@/features/technologies/schemas";
import { getDb } from "@/server/db";
import { isDatabaseUnavailable } from "@/server/database-resilience";
import { requireAdmin } from "@/server/permissions/require-admin";

function values(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    icon: String(formData.get("icon") ?? ""),
  };
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
  return {
    message: "Review the highlighted fields.",
    errors: { name: [message] },
    values: submitted,
    submissionId: crypto.randomUUID(),
    tone: "error",
  };
}

export async function createTechnology(
  _state: TechnologyFormState,
  formData: FormData,
): Promise<TechnologyFormState> {
  const session = await requireAdmin();
  const submitted = values(formData);
  const parsed = technologyFormSchema.safeParse(submitted);
  if (!parsed.success)
    return {
      message: "Review the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
      values: submitted,
      submissionId: crypto.randomUUID(),
      tone: "error",
    };
  const slug = technologySlug(parsed.data.name);
  if (!slug) return fieldError("Use a name containing letters or numbers.", submitted);
  const duplicate = await getDb().technology.findFirst({
    where: { OR: [{ name: { equals: parsed.data.name, mode: "insensitive" } }, { slug }] },
    select: { id: true },
  });
  if (duplicate) return fieldError("That technology already exists.", submitted);
  const last = await getDb().technology.findFirst({
    orderBy: { position: "desc" },
    select: { position: true },
  });
  const technology = await getDb().$transaction(async (transaction) => {
    const created = await transaction.technology.create({
      data: {
        ...parsed.data,
        icon: parsed.data.icon || null,
        slug,
        position: (last?.position ?? -1) + 1,
      },
    });
    await transaction.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "TECHNOLOGY_CREATED",
        entityType: "Technology",
        entityId: created.id,
        metadata: { name: created.name },
      },
    });
    return created;
  });
  refreshTechnologyPaths();
  return {
    message: `${technology.name} added.`,
    submissionId: crypto.randomUUID(),
    tone: "success",
  };
}

export async function updateTechnology(
  id: string,
  _state: TechnologyFormState,
  formData: FormData,
): Promise<TechnologyFormState> {
  const session = await requireAdmin();
  const submitted = values(formData);
  const parsed = technologyFormSchema.safeParse(submitted);
  if (!parsed.success)
    return {
      message: "Review the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
      values: submitted,
      submissionId: crypto.randomUUID(),
      tone: "error",
    };
  const slug = technologySlug(parsed.data.name);
  if (!slug) return fieldError("Use a name containing letters or numbers.", submitted);
  const duplicate = await getDb().technology.findFirst({
    where: {
      id: { not: id },
      OR: [{ name: { equals: parsed.data.name, mode: "insensitive" } }, { slug }],
    },
    select: { id: true },
  });
  if (duplicate) return fieldError("That technology already exists.", submitted);
  const existing = await getDb().technology.findUnique({ where: { id }, select: { id: true } });
  if (!existing)
    return {
      message: "This technology no longer exists.",
      submissionId: crypto.randomUUID(),
      tone: "error",
    };
  await getDb().$transaction([
    getDb().technology.update({
      where: { id },
      data: { ...parsed.data, icon: parsed.data.icon || null, slug },
    }),
    getDb().auditLog.create({
      data: {
        actorId: session.user.id,
        action: "TECHNOLOGY_UPDATED",
        entityType: "Technology",
        entityId: id,
        metadata: { name: parsed.data.name },
      },
    }),
  ]);
  refreshTechnologyPaths();
  return { message: "Technology updated.", submissionId: crypto.randomUUID(), tone: "success" };
}

export async function moveTechnology(id: string, direction: "up" | "down") {
  await requireAdmin();
  const current = await getDb().technology.findUnique({
    where: { id },
    select: { category: true },
  });
  if (!current) return;
  const technologies = await getDb().technology.findMany({
    where: { category: current.category },
    orderBy: [{ position: "asc" }, { name: "asc" }],
    select: { id: true, position: true },
  });
  const index = technologies.findIndex((technology) => technology.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= technologies.length) return;
  const reordered = [...technologies];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
  const firstPosition = Math.min(...reordered.map((technology) => technology.position));
  await getDb().$transaction(
    reordered.map((technology, position) =>
      getDb().technology.update({
        where: { id: technology.id },
        data: { position: firstPosition + position },
      }),
    ),
  );
  refreshTechnologyPaths();
}

export async function deleteTechnology(
  id: string,
  _state: TechnologyFormState,
): Promise<TechnologyFormState> {
  void _state;
  const session = await requireAdmin();
  const technology = await getDb().technology.findUnique({
    where: { id },
    select: { name: true, _count: { select: { projects: true } } },
  });
  if (!technology)
    return {
      message: "This technology no longer exists.",
      submissionId: crypto.randomUUID(),
      tone: "error",
    };
  if (technology._count.projects)
    return {
      message: `Remove ${technology.name} from ${technology._count.projects} project${technology._count.projects === 1 ? "" : "s"} before deleting it.`,
      errors: { name: ["Technology is still in use."] },
      submissionId: crypto.randomUUID(),
      tone: "error",
    };
  await getDb().$transaction([
    getDb().technology.delete({ where: { id } }),
    getDb().auditLog.create({
      data: {
        actorId: session.user.id,
        action: "TECHNOLOGY_DELETED",
        entityType: "Technology",
        entityId: id,
        metadata: { name: technology.name },
      },
    }),
  ]);
  refreshTechnologyPaths();
  return {
    message: `${technology.name} removed.`,
    submissionId: crypto.randomUUID(),
    tone: "success",
  };
}

export async function syncTechnologyLibrary(
  _state: TechnologySyncState,
): Promise<TechnologySyncState> {
  void _state;
  const session = await requireAdmin();
  const db = getDb();

  try {
    const result = await db.$transaction(
      async (transaction) => {
        const matchedIds = new Set<string>();
        let created = 0;
        let updated = 0;
        const existingTechnologies = await transaction.technology.findMany({
          select: { id: true, name: true, slug: true, category: true, icon: true, position: true },
        });
        const existingBySlug = new Map(
          existingTechnologies.map((technology) => [technology.slug, technology]),
        );
        const existingByName = new Map(
          existingTechnologies.map((technology) => [
            technology.name.toLocaleLowerCase(),
            technology,
          ]),
        );

        for (const [position, item] of TECHNOLOGY_LIBRARY.entries()) {
          const slug = technologySlug(item.name);
          const existing =
            existingBySlug.get(slug) ?? existingByName.get(item.name.toLocaleLowerCase());

          if (existing) {
            matchedIds.add(existing.id);
            const changed =
              existing.name !== item.name ||
              existing.category !== item.category ||
              existing.icon !== item.icon ||
              existing.position !== position;
            if (changed) {
              await transaction.technology.update({
                where: { id: existing.id },
                data: { name: item.name, slug, category: item.category, icon: item.icon, position },
              });
              updated += 1;
            }
          } else {
            const technology = await transaction.technology.create({
              data: { ...item, slug, position },
              select: { id: true },
            });
            matchedIds.add(technology.id);
            created += 1;
          }
        }

        const additional = await transaction.technology.findMany({
          where: { id: { notIn: [...matchedIds] } },
          orderBy: [{ position: "asc" }, { name: "asc" }],
          select: { id: true, position: true },
        });
        for (const [index, technology] of additional.entries()) {
          const position = TECHNOLOGY_LIBRARY.length + index;
          if (technology.position !== position)
            await transaction.technology.update({
              where: { id: technology.id },
              data: { position },
            });
        }

        await transaction.auditLog.create({
          data: {
            actorId: session.user.id,
            action: "TECHNOLOGY_LIBRARY_SYNCED",
            entityType: "Technology",
            entityId: "library",
            metadata: { created, updated, preservedAdditional: additional.length },
          },
        });
        return { created, updated, preservedAdditional: additional.length };
      },
      { maxWait: 10_000, timeout: 30_000 },
    );

    refreshTechnologyPaths();
    const customEntryLabel = result.preservedAdditional === 1 ? "entry" : "entries";
    return {
      tone: "success",
      message:
        `Library ready: ${result.created} added, ${result.updated} refreshed, and ` +
        `${result.preservedAdditional} existing custom ${customEntryLabel} preserved. ` +
        "Project assignments were not changed.",
      submissionId: crypto.randomUUID(),
    };
  } catch (error) {
    console.error("[technologies:sync] Unable to sync library", error);
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    const message = isDatabaseUnavailable(error)
      ? "The database could not be reached. Nothing was changed; check the connection and try again."
      : code === "P2028"
        ? "The database transaction timed out before the library finished syncing. Nothing was committed; please try once more."
        : code === "P2002"
          ? "A technology name or slug conflicts with an existing entry. Nothing was changed; review duplicate technologies and retry."
          : "The library could not be synchronized. Nothing was changed; please try again.";
    return { tone: "error", message, submissionId: crypto.randomUUID() };
  }
}
