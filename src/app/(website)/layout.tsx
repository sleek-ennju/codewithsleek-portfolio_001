import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Metadata } from "next";
import { getSiteSettings } from "@/features/settings/queries";

export async function generateMetadata(): Promise<Metadata> { const settings = await getSiteSettings(); return { title: { default: settings.seoTitle, template: `%s | ${settings.brandName}` }, description: settings.seoDescription, openGraph: { title: settings.seoTitle, description: settings.seoDescription }, twitter: { card: "summary_large_image", title: settings.seoTitle, description: settings.seoDescription } }; }

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><div id="main-content">{children}</div><SiteFooter /></>;
}
