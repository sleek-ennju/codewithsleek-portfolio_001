import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return <><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader /><div id="main-content">{children}</div><SiteFooter /></>;
}
