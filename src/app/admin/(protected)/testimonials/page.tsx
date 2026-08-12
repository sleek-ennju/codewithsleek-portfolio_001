import { TestimonialManager } from "@/features/testimonials/testimonial-manager";
import { getDb } from "@/server/db";

export default async function TestimonialsPage() {
  const [testimonials, projects, photos] = await Promise.all([
    getDb().testimonial.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }], select: { id: true, authorName: true, authorRole: true, quote: true, published: true, featured: true, projectId: true, photoId: true, client: { select: { name: true } } } }),
    getDb().project.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
    getDb().mediaAsset.findMany({ where: { kind: "IMAGE" }, orderBy: { fileName: "asc" }, select: { id: true, fileName: true } }),
  ]);
  return <main className="admin-main"><div className="admin-page-heading"><div><p className="admin-eyebrow">Content system</p><h1>Testimonials</h1><p>Publish concise, attributable client proof and associate it with relevant work.</p></div></div><TestimonialManager testimonials={testimonials.map(({ client, ...item }) => ({ ...item, clientName: client?.name ?? "Independent client" }))} projects={projects.map((project) => ({ id: project.id, label: project.title }))} photos={photos.map((photo) => ({ id: photo.id, label: photo.fileName }))} /></main>;
}
