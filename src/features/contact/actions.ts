"use server";

import { revalidatePath } from "next/cache";

import { contactFormSchema, type ContactFormState } from "./schemas";
import { getDb } from "@/server/db";
import { requireAdmin } from "@/server/permissions/require-admin";

function valuesFrom(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
}

export async function submitContactForm(_state: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const values = valuesFrom(formData);

  // Bots tend to fill fields hidden from people. Return the same success state
  // so the trap does not reveal itself.
  if (String(formData.get("companyWebsite") ?? "")) {
    return { status: "success", message: "Thanks—your message has been received.", submissionId: crypto.randomUUID() };
  }

  const parsed = contactFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
      values,
      submissionId: crypto.randomUUID(),
    };
  }

  try {
    await getDb().contactSubmission.create({ data: parsed.data });
  } catch {
    return {
      status: "error",
      message: "Your message could not be sent right now. Please try again shortly.",
      values: parsed.data,
      submissionId: crypto.randomUUID(),
    };
  }

  revalidatePath("/admin/contact");
  revalidatePath("/admin/dashboard");
  return {
    status: "success",
    message: "Thanks—your message is safely in my inbox. I’ll get back to you soon.",
    submissionId: crypto.randomUUID(),
  };
}

export async function setContactReadState(submissionId: string, read: boolean) {
  const session = await requireAdmin();
  const submission = await getDb().contactSubmission.update({
    where: { id: submissionId },
    data: { readAt: read ? new Date() : null },
    select: { id: true },
  });

  await getDb().auditLog.create({
    data: {
      actorId: session.user.id,
      action: read ? "CONTACT_MARKED_READ" : "CONTACT_MARKED_UNREAD",
      entityType: "ContactSubmission",
      entityId: submission.id,
    },
  });

  revalidatePath("/admin/contact");
  revalidatePath("/admin/dashboard");
}
