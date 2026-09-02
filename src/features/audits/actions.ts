"use server";

import { revalidatePath } from "next/cache";

import { runPageSpeedAudit } from "./pagespeed";
import { auditRequestSchema, type AuditFormState } from "./schemas";
import type { Prisma } from "@/generated/prisma/client";
import { getDb } from "@/server/db";
import { requireAdmin } from "@/server/permissions/require-admin";

function valuesFrom(formData: FormData) {
  return {
    projectId: String(formData.get("projectId") ?? ""),
    testedUrl: String(formData.get("testedUrl") ?? ""),
    strategy: String(formData.get("strategy") ?? "MOBILE"),
  };
}

function failureMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.name === "TimeoutError") return "The PageSpeed request timed out. Try again shortly.";
    return error.message.slice(0, 500);
  }
  return "The PageSpeed audit could not be completed.";
}

export async function createPerformanceAudit(
  _state: AuditFormState,
  formData: FormData,
): Promise<AuditFormState> {
  const session = await requireAdmin();
  const parsed = auditRequestSchema.safeParse(valuesFrom(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Review the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
      submissionId: crypto.randomUUID(),
    };

  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  if (!apiKey)
    return {
      status: "error",
      message: "Add GOOGLE_PAGESPEED_API_KEY to the project environment before running an audit.",
      values: parsed.data,
      submissionId: crypto.randomUUID(),
    };

  const project = await getDb().project.findFirst({
    where: { id: parsed.data.projectId, status: "PUBLISHED" },
    select: { id: true, title: true },
  });
  if (!project)
    return {
      status: "error",
      message: "Choose a published project that still exists.",
      values: parsed.data,
      submissionId: crypto.randomUUID(),
    };

  const audit = await getDb().performanceAudit.create({
    data: {
      projectId: project.id,
      testedUrl: parsed.data.testedUrl,
      strategy: parsed.data.strategy,
      status: "PENDING",
    },
    select: { id: true },
  });
  await getDb().performanceAudit.update({ where: { id: audit.id }, data: { status: "RUNNING" } });

  try {
    const result = await runPageSpeedAudit(parsed.data.testedUrl, parsed.data.strategy, apiKey);
    await getDb().$transaction([
      getDb().performanceAudit.update({
        where: { id: audit.id },
        data: {
          ...result,
          rawSnapshot: result.rawSnapshot as Prisma.InputJsonValue,
          status: "SUCCEEDED",
          failureMessage: null,
        },
      }),
      getDb().auditLog.create({
        data: {
          actorId: session.user.id,
          action: "PERFORMANCE_AUDIT_SUCCEEDED",
          entityType: "PerformanceAudit",
          entityId: audit.id,
          metadata: { projectId: project.id, strategy: parsed.data.strategy },
        },
      }),
    ]);
  } catch (error) {
    const message = failureMessage(error);
    await getDb().$transaction([
      getDb().performanceAudit.update({
        where: { id: audit.id },
        data: { status: "FAILED", failureMessage: message },
      }),
      getDb().auditLog.create({
        data: {
          actorId: session.user.id,
          action: "PERFORMANCE_AUDIT_FAILED",
          entityType: "PerformanceAudit",
          entityId: audit.id,
          metadata: { projectId: project.id, strategy: parsed.data.strategy },
        },
      }),
    ]);
    revalidatePath("/admin/audits");
    revalidatePath("/admin/dashboard");
    return { status: "error", message, values: parsed.data, submissionId: crypto.randomUUID() };
  }

  revalidatePath("/admin/audits");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  return {
    status: "success",
    message: `${project.title} was audited successfully and saved privately.`,
    values: parsed.data,
    submissionId: crypto.randomUUID(),
  };
}

export async function setPerformanceAuditVisibility(id: string, publicVisible: boolean) {
  const session = await requireAdmin();
  const audit = await getDb().performanceAudit.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!audit) return;
  if (publicVisible && audit.status !== "SUCCEEDED")
    throw new Error("Only successful audits can be shown publicly.");

  await getDb().$transaction([
    getDb().performanceAudit.update({ where: { id }, data: { publicVisible } }),
    getDb().auditLog.create({
      data: {
        actorId: session.user.id,
        action: publicVisible ? "PERFORMANCE_AUDIT_PUBLISHED" : "PERFORMANCE_AUDIT_HIDDEN",
        entityType: "PerformanceAudit",
        entityId: id,
      },
    }),
  ]);
  revalidatePath("/admin/audits");
  revalidatePath("/");
}
