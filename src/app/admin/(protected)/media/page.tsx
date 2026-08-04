import { MediaManager } from "@/features/media/media-manager";
import { getDb } from "@/server/db";

export default async function AdminMediaPage() {
  const [assets, configured] = await Promise.all([
    getDb().mediaAsset.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, secureUrl: true, altText: true, fileName: true, width: true, height: true, bytes: true } }),
    Promise.resolve(Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)),
  ]);
  return <main className="admin-main"><div className="admin-page-heading"><div><p className="admin-eyebrow">Assets</p><h1>Media</h1><p>Secure Cloudinary media with database references and deletion safeguards.</p></div></div><MediaManager assets={assets} configured={configured} /></main>;
}
