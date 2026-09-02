import Link from "next/link";
import Image from "next/image";

import { endAdminSession } from "@/features/auth/actions";

const adminNavigation = [
  { href: "/admin/dashboard", label: "Overview", short: "OV" },
  { href: "/admin/projects", label: "Projects", short: "PR" },
  { href: "/admin/media", label: "Media", short: "ME" },
  { href: "/admin/contact", label: "Contact", short: "CO" },
  { href: "/admin/audits", label: "Audits", short: "AU" },
  { href: "/admin/testimonials", label: "Testimonials", short: "TE" },
  { href: "/admin/technologies", label: "Technologies", short: "TC" },
  { href: "/admin/settings", label: "Settings", short: "ST" },
] as const;

export function AdminShell({
  children,
  adminName,
}: {
  children: React.ReactNode;
  adminName: string;
}) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin/dashboard">
          <span>
            <Image src="/logos/cws_logo_mark.png" alt="" width={460} height={383} sizes="32px" />
          </span>
          <strong>CODEwithSleek</strong>
        </Link>
        <nav aria-label="Administration">
          {adminNavigation.map((item) => (
            <Link href={item.href} key={item.href}>
              <span aria-hidden="true">{item.short}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <p>Signed in as</p>
          <strong>{adminName}</strong>
          <form action={endAdminSession}>
            <button type="submit">Sign out</button>
          </form>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <details className="admin-mobile-menu">
            <summary>Menu</summary>
            <nav aria-label="Mobile administration">
              {adminNavigation.map((item) => (
                <Link href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
          <Link href="/" target="_blank">
            View live site <span aria-hidden="true">↗</span>
          </Link>
        </header>
        {children}
      </div>
    </div>
  );
}
