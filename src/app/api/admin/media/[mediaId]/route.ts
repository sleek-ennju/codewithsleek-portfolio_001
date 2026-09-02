import { auth } from "@/auth";
import { destroyPortfolioImage } from "@/server/cloudinary";
import { getDb } from "@/server/db";

export const runtime = "nodejs";

export async function DELETE(request: Request, context: { params: Promise<{ mediaId: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host"))
    return Response.json({ error: "Invalid request origin" }, { status: 403 });
  const { mediaId } = await context.params;
  const asset = await getDb().mediaAsset.findUnique({
    where: { id: mediaId },
    include: {
      _count: {
        select: {
          projectImages: true,
          cardForProjects: true,
          coverForProjects: true,
          socialForProjects: true,
          clientLogos: true,
          testimonialPhotos: true,
        },
      },
    },
  });
  if (!asset) return Response.json({ error: "Media asset not found." }, { status: 404 });
  const references = Object.values(asset._count).reduce((total, count) => total + count, 0);
  if (references > 0)
    return Response.json(
      { error: "Remove this asset from all content before deleting it." },
      { status: 409 },
    );
  await destroyPortfolioImage(asset.cloudinaryId);
  await getDb().$transaction([
    getDb().mediaAsset.delete({ where: { id: asset.id } }),
    getDb().auditLog.create({
      data: {
        actorId: session.user.id,
        action: "MEDIA_DELETED",
        entityType: "MediaAsset",
        entityId: asset.id,
      },
    }),
  ]);
  return new Response(null, { status: 204 });
}
