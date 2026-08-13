import Link from "next/link";

import { siteConfig } from "@/config/site";
import { getSiteSettings } from "@/features/settings/queries";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

export async function SiteHeader() {
  const settings = await getSiteSettings();
  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link className="brand" href="/" aria-label="Code with Sleek home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span className="brand-copy">
            <strong>{settings.brandName}</strong>
            <small>{settings.tagline}</small>
          </span>
        </Link>

        <nav aria-label="Primary navigation">
          <ul className="nav-links">
            {siteConfig.navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNavigation items={siteConfig.navigation} bookingUrl={settings.bookingUrl} />

        <Link className="button button-dark nav-cta" href={settings.bookingUrl || "/#contact"} target={settings.bookingUrl ? "_blank" : undefined}>
          Book a call
        </Link>
      </div>
    </header>
  );
}
