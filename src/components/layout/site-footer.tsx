import Link from "next/link";
import { getSiteSettings } from "@/features/settings/queries";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const socials = [{ label: "GitHub", href: settings.githubUrl }, { label: "LinkedIn", href: settings.linkedinUrl }, { label: "X", href: settings.xUrl }].filter((item): item is { label: string; href: string } => Boolean(item.href));
  return <footer className="site-footer"><div className="container footer-grid"><div><p className="footer-brand">{settings.brandName}</p><p className="footer-note">{settings.tagline}</p></div><div><p className="footer-label">Start a conversation</p><Link className="footer-pending" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</Link></div><div><p className="footer-label">Elsewhere</p>{socials.length ? <div className="footer-socials">{socials.map((item) => <Link href={item.href} key={item.label} target="_blank">{item.label}</Link>)}</div> : <p className="footer-pending">Social profiles coming soon.</p>}</div><p className="footer-copyright">© {new Date().getFullYear()} Code with Sleek</p></div></footer>;
}
