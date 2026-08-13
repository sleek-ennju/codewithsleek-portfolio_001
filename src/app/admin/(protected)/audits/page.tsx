import Link from "next/link";

import { setPerformanceAuditVisibility } from "@/features/audits/actions";
import { AuditRunner } from "@/features/audits/audit-runner";
import { getDb } from "@/server/db";

export const maxDuration = 150;

export default async function AdminAuditsPage() {
  const [projects, audits] = await Promise.all([
    getDb().project.findMany({ where: { status: "PUBLISHED" }, orderBy: { title: "asc" }, select: { id: true, title: true, liveUrl: true, demoUrl: true } }),
    getDb().performanceAudit.findMany({ take: 30, orderBy: { createdAt: "desc" }, select: { id: true, testedUrl: true, strategy: true, status: true, publicVisible: true, performanceScore: true, accessibilityScore: true, bestPracticesScore: true, seoScore: true, auditedAt: true, createdAt: true, failureMessage: true, source: true, project: { select: { title: true, slug: true } } } }),
  ]);
  const configured = Boolean(process.env.GOOGLE_PAGESPEED_API_KEY);

  return <main className="admin-main">
    <div className="admin-page-heading"><div><p className="admin-eyebrow">Measured evidence</p><h1>Performance audits</h1><p>Run dated Google PageSpeed checks, then choose which successful results are safe to show publicly.</p></div></div>
    <section className="admin-panel admin-audit-runner"><div className="admin-panel-heading"><div><p className="admin-eyebrow">New run</p><h2>Audit a published experience</h2></div><span className={`admin-status ${configured ? "admin-status-published" : "admin-status-archived"}`}>{configured ? "API ready" : "Key required"}</span></div>
      {!configured ? <p className="admin-audit-notice">Set <code>GOOGLE_PAGESPEED_API_KEY</code> locally and in Vercel before running an audit.</p> : null}
      {projects.length ? <AuditRunner configured={configured} projects={projects} /> : <div className="admin-empty-state"><strong>No published projects are available.</strong><p>Publish a project before recording performance evidence.</p></div>}
    </section>
    <section className="admin-audit-history"><div className="admin-panel-heading"><div><p className="admin-eyebrow">History</p><h2>Recent audit runs</h2></div></div>
      {audits.length ? <div className="admin-audit-list">{audits.map((audit) => <article key={audit.id}>
        <header><div><span className={`admin-status admin-audit-status-${audit.status.toLowerCase()}`}>{audit.status}</span>{audit.publicVisible && <span className="admin-status admin-status-published">Public</span>}<p>{audit.strategy.toLowerCase()} · {audit.auditedAt ? audit.auditedAt.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : audit.createdAt.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p></div><Link href={`/projects/${audit.project.slug}`} target="_blank">View project ↗</Link></header>
        <h3>{audit.project.title}</h3><a href={audit.testedUrl} rel="noreferrer" target="_blank">{audit.testedUrl}</a>
        {audit.status === "SUCCEEDED" ? <dl>{[{ label: "Performance", value: audit.performanceScore }, { label: "Accessibility", value: audit.accessibilityScore }, { label: "Best practices", value: audit.bestPracticesScore }, { label: "SEO", value: audit.seoScore }].map((score) => <div key={score.label}><dt>{score.value ?? "—"}</dt><dd>{score.label}</dd></div>)}</dl> : audit.failureMessage ? <p className="admin-audit-failure">{audit.failureMessage}</p> : <p className="admin-audit-pending">The audit is still processing.</p>}
        <footer><span>{audit.source}</span>{audit.status === "SUCCEEDED" && <form action={setPerformanceAuditVisibility.bind(null, audit.id, !audit.publicVisible)}><button className="admin-secondary-button" type="submit">{audit.publicVisible ? "Hide from website" : "Show publicly"}</button></form>}</footer>
      </article>)}</div> : <div className="admin-panel admin-empty-state"><strong>No audits recorded yet.</strong><p>Your first mobile or desktop run will appear here with its dated outcome.</p></div>}
    </section>
  </main>;
}
