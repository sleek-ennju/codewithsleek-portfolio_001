import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Metadata } from "next";
import { getSiteSettings } from "@/features/settings/queries";
import { JsonLd } from "@/components/shared/json-ld";
import { absoluteUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> { const settings = await getSiteSettings(); return { title: { default: settings.seoTitle, template: `%s | ${settings.brandName}` }, description: settings.seoDescription, openGraph: { title: settings.seoTitle, description: settings.seoDescription, url: "/", siteName: settings.brandName, type: "website", locale: "en_NG" }, twitter: { card: "summary_large_image", title: settings.seoTitle, description: settings.seoDescription } }; }

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const sameAs = [settings.githubUrl, settings.linkedinUrl, settings.xUrl].filter(Boolean);
  return <><JsonLd data={{ "@context": "https://schema.org", "@type": "Person", name: "Emmanuel Ihenacho", alternateName: settings.brandName, url: absoluteUrl("/"), email: `mailto:${settings.contactEmail}`, jobTitle: "Frontend Engineer", sameAs }} /><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><div id="main-content" tabIndex={-1}>{children}</div><SiteFooter /></>;
}
