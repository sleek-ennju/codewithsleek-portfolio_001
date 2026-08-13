import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/features/settings/queries";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const socials = [{ label: "GitHub", href: settings.githubUrl }, { label: "LinkedIn", href: settings.linkedinUrl }, { label: "X", href: settings.xUrl }].filter((item): item is { label: string; href: string } => Boolean(item.href));
  return <footer className="site-footer"><div className="container"><div className="footer-invitation"><p>Have a product in mind?</p><Link href="#contact">Let&apos;s make it clear, useful, <span>and beautifully built.</span><i aria-hidden="true">↗</i></Link></div><div className="footer-grid"><div className="footer-identity"><Image src="/logos/cws_logo_wordmark.png" alt={`${settings.brandName} — ${settings.tagline}`} width={1300} height={683} sizes="180px" /></div><div><p className="footer-label">Start a conversation</p><Link className="footer-pending" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</Link></div><div><p className="footer-label">Elsewhere</p>{socials.length ? <div className="footer-socials">{socials.map((item) => <Link href={item.href} key={item.label} target="_blank" rel="noreferrer">{item.label}<span aria-hidden="true">↗</span></Link>)}</div> : <p className="footer-pending">Social profiles coming soon.</p>}</div><p className="footer-copyright">© {new Date().getFullYear()} Code with Sleek<br />All rights reserved.</p></div></div></footer>;
}
