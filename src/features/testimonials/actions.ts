"use server";

import { revalidatePath } from "next/cache";

import { testimonialFormSchema, type TestimonialFormState } from "@/features/testimonials/schemas";
import { getDb } from "@/server/db";
import { requireAdmin } from "@/server/permissions/require-admin";

function snapshot(formData: FormData) {
  return {
    authorName: String(formData.get("authorName") ?? ""),
    authorRole: String(formData.get("authorRole") ?? ""),
    clientName: String(formData.get("clientName") ?? ""),
    quote: String(formData.get("quote") ?? ""),
    projectId: String(formData.get("projectId") ?? ""),
    photoId: String(formData.get("photoId") ?? ""),
    published: formData.get("published") === "on",
    featured: formData.get("featured") === "on",
  };
}

function refreshTestimonials(projectSlug?: string | null) {
  revalidatePath("/admin/testimonials");
  revalidatePath("/admin");
  revalidatePath("/");
  if (projectSlug) revalidatePath(`/projects/${projectSlug}`);
}

async function referencesExist(projectId: string, photoId: string) {
  const [project, photo] = await Promise.all([
    projectId
      ? getDb().project.findUnique({ where: { id: projectId }, select: { id: true } })
      : true,
    photoId
      ? getDb().mediaAsset.findUnique({ where: { id: photoId }, select: { id: true } })
      : true,
  ]);
  return Boolean(project && photo);
}

export async function createTestimonial(
  _state: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
  const session = await requireAdmin();
  const values = snapshot(formData);
  const parsed = testimonialFormSchema.safeParse(values);
  if (!parsed.success)
    return {
      message: "Review the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
      values,
      submissionId: crypto.randomUUID(),
    };
  if (!(await referencesExist(parsed.data.projectId, parsed.data.photoId)))
    return {
      message: "The selected project or photo no longer exists.",
      values,
      submissionId: crypto.randomUUID(),
    };
  const last = await getDb().testimonial.findFirst({
    orderBy: { displayOrder: "desc" },
    select: { displayOrder: true },
  });
  await getDb().$transaction(async (transaction) => {
    const client = await transaction.client.upsert({
      where: { name: parsed.data.clientName },
      update: {},
      create: { name: parsed.data.clientName },
    });
    const created = await transaction.testimonial.create({
      data: {
        authorName: parsed.data.authorName,
        authorRole: parsed.data.authorRole,
        quote: parsed.data.quote,
        clientId: client.id,
        projectId: parsed.data.projectId || null,
        photoId: parsed.data.photoId || null,
        published: parsed.data.published,
        featured: parsed.data.featured,
        displayOrder: (last?.displayOrder ?? -1) + 1,
      },
    });
    await transaction.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "TESTIMONIAL_CREATED",
        entityType: "Testimonial",
        entityId: created.id,
      },
    });
  });
  refreshTestimonials();
  return { message: "Testimonial added.", submissionId: crypto.randomUUID() };
}

export async function updateTestimonial(
  id: string,
  _state: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
  const session = await requireAdmin();
  const values = snapshot(formData);
  const parsed = testimonialFormSchema.safeParse(values);
  if (!parsed.success)
    return {
      message: "Review the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
      values,
      submissionId: crypto.randomUUID(),
    };
  if (!(await referencesExist(parsed.data.projectId, parsed.data.photoId)))
    return {
      message: "The selected project or photo no longer exists.",
      values,
      submissionId: crypto.randomUUID(),
    };
  const existing = await getDb().testimonial.findUnique({
    where: { id },
    select: { project: { select: { slug: true } } },
  });
  if (!existing) return { message: "This testimonial no longer exists." };
  await getDb().$transaction(async (transaction) => {
    const client = await transaction.client.upsert({
      where: { name: parsed.data.clientName },
      update: {},
      create: { name: parsed.data.clientName },
    });
    await transaction.testimonial.update({
      where: { id },
      data: {
        authorName: parsed.data.authorName,
        authorRole: parsed.data.authorRole,
        quote: parsed.data.quote,
        clientId: client.id,
        projectId: parsed.data.projectId || null,
        photoId: parsed.data.photoId || null,
        published: parsed.data.published,
        featured: parsed.data.featured,
      },
    });
    await transaction.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "TESTIMONIAL_UPDATED",
        entityType: "Testimonial",
        entityId: id,
      },
    });
  });
  refreshTestimonials(existing.project?.slug);
  return { message: "Testimonial updated.", submissionId: crypto.randomUUID() };
}

export async function moveTestimonial(id: string, direction: "up" | "down") {
  await requireAdmin();
  const rows = await getDb().testimonial.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true },
  });
  const index = rows.findIndex((row) => row.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= rows.length) return;
  const reordered = [...rows];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
  await getDb().$transaction(
    reordered.map((row, displayOrder) =>
      getDb().testimonial.update({ where: { id: row.id }, data: { displayOrder } }),
    ),
  );
  refreshTestimonials();
}

export async function deleteTestimonial(
  id: string,
  _state: TestimonialFormState,
): Promise<TestimonialFormState> {
  void _state;
  const session = await requireAdmin();
  const existing = await getDb().testimonial.findUnique({
    where: { id },
    select: { project: { select: { slug: true } } },
  });
  if (!existing) return { message: "This testimonial no longer exists." };
  await getDb().$transaction([
    getDb().testimonial.delete({ where: { id } }),
    getDb().auditLog.create({
      data: {
        actorId: session.user.id,
        action: "TESTIMONIAL_DELETED",
        entityType: "Testimonial",
        entityId: id,
      },
    }),
  ]);
  refreshTestimonials(existing.project?.slug);
  return { message: "Testimonial removed.", submissionId: crypto.randomUUID() };
}
