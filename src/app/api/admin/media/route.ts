import { auth } from "@/auth";
import { getDb } from "@/server/db";
import { destroyPortfolioImage, uploadPortfolioImage } from "@/server/cloudinary";

export const runtime = "nodejs";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const maxBytes = 10 * 1024 * 1024;

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || new URL(origin).host === request.headers.get("host");
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid request origin" }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get("file");
  const altText = String(formData.get("altText") ?? "").trim();
  if (!(file instanceof File))
    return Response.json({ error: "Choose an image to upload." }, { status: 400 });
  if (!allowedTypes.has(file.type))
    return Response.json({ error: "Use JPEG, PNG, WebP, AVIF, or GIF." }, { status: 400 });
  if (file.size > maxBytes)
    return Response.json({ error: "Images must be 10 MB or smaller." }, { status: 400 });
  if (altText.length > 300)
    return Response.json({ error: "Alt text must be 300 characters or fewer." }, { status: 400 });

  const uploaded = await uploadPortfolioImage(Buffer.from(await file.arrayBuffer()));
  try {
    const asset = await getDb().mediaAsset.create({
      data: {
        cloudinaryId: uploaded.public_id,
        kind: "IMAGE",
        fileName: file.name.trim() || uploaded.original_filename,
        format: uploaded.format,
        mimeType: file.type,
        bytes: uploaded.bytes,
        width: uploaded.width,
        height: uploaded.height,
        altText: altText || null,
        secureUrl: uploaded.secure_url,
      },
      select: { id: true },
    });
    await getDb().auditLog.create({
      data: {
        actorId: session.user.id,
        action: "MEDIA_UPLOADED",
        entityType: "MediaAsset",
        entityId: asset.id,
      },
    });
    return Response.json({ id: asset.id }, { status: 201 });
  } catch (error) {
    await destroyPortfolioImage(uploaded.public_id).catch(() => undefined);
    throw error;
  }
}
