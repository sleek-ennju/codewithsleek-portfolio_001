import type { Metadata } from "next";
import Link from "next/link";
import { DiagonalArrow } from "@/components/shared/diagonal-arrow";
import { ResumeDownload } from "@/components/shared/resume-download";
import { siteConfig } from "@/config/site";
import { getSiteSettings } from "@/features/settings/queries";

export const metadata: Metadata = {
  title: "Résumé",
  description:
    "View the professional résumé of Emmanuel Ihenacho, frontend engineer and founder of Code with Sleek.",
  alternates: { canonical: "/resume" },
};

export default async function ResumePage() {
  const settings = await getSiteSettings();
  const resumeUrl = settings.resumeUrl || siteConfig.resumePath;

  return (
    <main className="page-shell resume-page container">
      <div className="resume-page-copy">
        <p className="section-kicker">Résumé · Emmanuel Ihenacho</p>
        <h1>Product thinking, expressed through frontend engineering.</h1>
        <p>
          A focused overview of my experience building responsive interfaces, scalable product
          systems, thoughtful motion, and dependable integrations.
        </p>
        <div className="resume-page-actions">
          <ResumeDownload href={resumeUrl} />
          <Link className="text-link resume-return-link" href="/">
            Return home <DiagonalArrow />
          </Link>
        </div>
      </div>
      <aside className="resume-page-note" aria-label="Résumé availability">
        <span>Ready to download</span>
        <strong>One click. Your copy.</strong>
        <p>
          The current résumé is packaged as a lightweight PDF for quick reading, saving, sharing, or
          printing.
        </p>
        <div className="resume-note-meta">
          <span>PDF</span>
          <span>1 page</span>
          <span>Current edition</span>
        </div>
      </aside>
    </main>
  );
}
