import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

import { getCloudinaryEnv } from "@/config/env";

function client() {
  const env = getCloudinaryEnv();
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

export function uploadPortfolioImage(buffer: Buffer) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = client().uploader.upload_stream(
      {
        resource_type: "image",
        folder: "codewithsleek/portfolio",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) reject(error ?? new Error("Cloudinary returned no upload result."));
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
}

export async function destroyPortfolioImage(publicId: string) {
  return client().uploader.destroy(publicId, { resource_type: "image", invalidate: true });
}
