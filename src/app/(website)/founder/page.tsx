import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { FounderPage } from "@/features/founder/founder-page";
import { getSiteSettings } from "@/features/settings/queries";

export const metadata: Metadata = {
  title: "Founder",
  description:
    "Meet Emmanuel Ihenacho, founder and lead engineer of CodeWithSleek: experience, stack and résumé.",
  alternates: { canonical: "/founder" },
};

export default async function Page() {
  const settings = await getSiteSettings();
  // The bundled PDF guarantees a working download; administrators can replace it without a deploy.
  const resumeUrl = settings.resumeUrl || siteConfig.resumePath;
  const githubUrl = settings.githubUrl || "https://github.com/sleek-ennju";
  return <FounderPage resumeUrl={resumeUrl} githubUrl={githubUrl} />;
}
