import { notFound } from "next/navigation";

const modules: Record<string, { title: string; description: string }> = {
  media: { title: "Media", description: "Cloudinary upload validation and the reusable media library arrive in Sprint 5." },
  audits: { title: "Performance audits", description: "Google PageSpeed audit execution and dated history arrive in Sprint 9." },
  testimonials: { title: "Testimonials", description: "Social-proof content management is prepared for the project CMS implementation." },
  technologies: { title: "Technologies", description: "Reusable technology categories will connect to the project editor in Sprint 4." },
  settings: { title: "Site settings", description: "Verified contact details, social profiles, homepage copy, résumé, and SEO defaults will live here." },
  "audit-log": { title: "Audit log", description: "Publishing and destructive administration events will be recorded here." },
};

export default async function AdminModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const item = modules[module];
  if (!item) notFound();
  return <main className="admin-main"><p className="admin-eyebrow">Administration module</p><h1 className="admin-standalone-title">{item.title}</h1><p className="admin-standalone-copy">{item.description}</p><div className="admin-panel admin-empty-state"><strong>The protected route is online.</strong><p>Its operational workflow will be added in the corresponding delivery sprint.</p></div></main>;
}
