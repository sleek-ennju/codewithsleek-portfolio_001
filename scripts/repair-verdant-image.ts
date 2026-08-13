import { readFile } from "node:fs/promises";
import path from "node:path";

import { PrismaPg } from "@prisma/adapter-pg";
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { config } from "dotenv";

import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local" });
config();

for (const name of ["DATABASE_URL", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"] as const) {
  if (!process.env[name]) throw new Error(`${name} is required.`);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const slug = "verdant-sustainable-commerce";

function uploadImage(buffer: Buffer) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "codewithsleek/portfolio/starter-case-studies",
        public_id: slug,
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error || !result) reject(error ?? new Error("Cloudinary returned no upload result."));
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
}

try {
  const project = await prisma.project.findUnique({ where: { slug }, select: { cardImageId: true } });
  if (!project?.cardImageId) throw new Error("Verdant Market does not have an assigned card image.");

  const imagePath = path.join(process.cwd(), "public", "generated-case-studies", "case-study-05.png");
  const upload = await uploadImage(await readFile(imagePath));

  await prisma.mediaAsset.update({
    where: { id: project.cardImageId },
    data: {
      cloudinaryId: upload.public_id,
      fileName: "case-study-05.png",
      format: upload.format,
      mimeType: `image/${upload.format}`,
      bytes: upload.bytes,
      width: upload.width,
      height: upload.height,
      altText: "Verdant Market sustainable commerce storefront, checkout, sales dashboard, and environmental impact reporting",
      secureUrl: upload.secure_url,
    },
  });

  console.log(`Repaired Verdant Market image: ${upload.secure_url}`);
} finally {
  await prisma.$disconnect();
}
