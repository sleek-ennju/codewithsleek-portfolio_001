import Link from "next/link";

import { getDashboardOverview } from "@/server/queries/dashboard";

export default async function AdminDashboardPage() {
  const overview = await getDashboardOverview();
  const cards = [
    ["Projects", overview.projects, "Total portfolio records"],
    ["Drafts", overview.drafts, "Require editorial attention"],
    ["Published", overview.published, "Visible to the public"],
    ["Featured", overview.featured, "Visible on the landing page"],
    ["Archived", overview.archived, "Hidden historical records"],
    ["Media", overview.media, "Managed Cloudinary assets"],
    ["Verified audits", overview.audits, "Successful dated results"],
    ["Testimonials", overview.testimonials, "Published social proof"],
  ] as const;

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div><p className="admin-eyebrow">Portfolio operations</p><h1>Dashboard</h1><p>Publishing health, content readiness, and recent administration activity.</p></div>
        <Link className="admin-primary-button" href="/admin/projects/new">Create project</Link>
      </div>
      <section className="admin-stat-grid" aria-label="Portfolio statistics">
        {cards.map(([label, value, description]) => (
          <article key={label}><p>{label}</p><strong>{value}</strong><span>{description}</span></article>
        ))}
      </section>
      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading"><div><p className="admin-eyebrow">Activity</p><h2>Recent changes</h2></div><Link href="/admin/audit-log">View audit log</Link></div>
          {overview.recentActivity.length ? (
            <ul className="admin-activity-list">
              {overview.recentActivity.map((item) => <li key={item.id}><span>{item.action}</span><strong>{item.entityType}</strong><time dateTime={item.createdAt.toISOString()}>{item.createdAt.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</time></li>)}
            </ul>
          ) : <div className="admin-empty-state"><strong>No changes recorded yet.</strong><p>Publishing and destructive actions will appear here.</p></div>}
        </section>
        <aside className="admin-panel admin-readiness">
          <p className="admin-eyebrow">Release readiness</p><h2>Foundation online</h2>
          <ul><li><span>Database model</span><strong>Ready</strong></li><li><span>Authentication</span><strong>Ready</strong></li><li><span>Content management</span><strong>Ready</strong></li><li><span>Media pipeline</span><strong>Ready</strong></li></ul>
        </aside>
      </div>
    </main>
  );
}
