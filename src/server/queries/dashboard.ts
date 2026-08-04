import { getDb } from "@/server/db";

export async function getDashboardOverview() {
  const db = getDb();
  const [projects, drafts, published, archived, featured, media, audits, testimonials, unreadContacts, recentActivity] = await Promise.all([
    db.project.count(),
    db.project.count({ where: { status: "DRAFT" } }),
    db.project.count({ where: { status: "PUBLISHED" } }),
    db.project.count({ where: { status: "ARCHIVED" } }),
    db.project.count({ where: { status: "PUBLISHED", featured: true } }),
    db.mediaAsset.count(),
    db.performanceAudit.count({ where: { status: "SUCCEEDED" } }),
    db.testimonial.count({ where: { published: true } }),
    db.contactSubmission.count({ where: { readAt: null } }),
    db.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, action: true, entityType: true, createdAt: true },
    }),
  ]);

  return { projects, drafts, published, archived, featured, media, audits, testimonials, unreadContacts, recentActivity };
}
