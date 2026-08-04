import Link from "next/link";

import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link className="brand" href="/" aria-label="Code with Sleek home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span className="brand-copy">
            <strong>CODEwithSleek</strong>
            <small>Crafting logic the sleek way</small>
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

        <details className="mobile-nav">
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            {siteConfig.navigation.map((item) => (
              <Link href={item.href} key={item.href}>{item.label}</Link>
            ))}
          </nav>
        </details>

        <Link className="button button-dark nav-cta" href="/#contact">
          Book a call
        </Link>
      </div>
    </header>
  );
}
