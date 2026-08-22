import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/features/settings/queries";
import { DiagonalArrow } from "@/components/shared/diagonal-arrow";
import { SiteFooterMotion } from "@/components/layout/site-footer-motion";

function GitHubIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .7a11.5 11.5 0 0 0-3.64 22.4c.58.1.79-.25.79-.56v-2.24c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.74-1.56-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.94 10.94 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.71 5.38-5.29 5.67.42.36.79 1.07.79 2.16v3.21c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" /></svg>;
}

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const socials = [
    { label: "GitHub", href: settings.githubUrl || "https://github.com/sleek-ennju", icon: <GitHubIcon /> },
    // Enable when the Code with Sleek account and final URL are ready:
    // { label: "LinkedIn", href: settings.linkedinUrl, icon: <LinkedInIcon /> },
    // { label: "X", href: settings.xUrl, icon: <XIcon /> },
    // { label: "Instagram", href: settings.instagramUrl, icon: <InstagramIcon /> },
  ];
  return <footer className="site-footer"><SiteFooterMotion /><div className="container"><div className="footer-invitation"><p>Have a product in mind?</p><Link href="#contact">Let&apos;s make it clear, useful, <span>and beautifully built.</span><i><DiagonalArrow /></i></Link></div><div className="footer-grid"><div className="footer-identity"><Image src="/logos/cws_logo_wordmark.png" alt={`${settings.brandName} — ${settings.tagline}`} width={1300} height={683} sizes="180px" /></div><div><p className="footer-label">Start a conversation</p><Link className="footer-pending" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</Link></div><div><p className="footer-label">Elsewhere</p>{socials.length ? <div className="footer-socials">{socials.map((item) => <Link href={item.href} aria-label={item.label} title={item.label} key={item.label} target="_blank" rel="noreferrer">{item.icon}<span>{item.label}</span></Link>)}</div> : <p className="footer-pending">GitHub profile coming soon.</p>}</div><p className="footer-copyright">© {new Date().getFullYear()} Code with Sleek<br />All rights reserved.</p></div></div></footer>;
}
