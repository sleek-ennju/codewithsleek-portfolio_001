ALTER TABLE "Testimonial" ADD COLUMN "projectId" TEXT;
ALTER TABLE "Testimonial" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX "Testimonial_projectId_idx" ON "Testimonial"("projectId");
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
