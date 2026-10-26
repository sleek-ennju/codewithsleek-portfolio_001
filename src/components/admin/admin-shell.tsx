import Link from "next/link";
import Image from "next/image";

import { AdminMobileNavigation } from "@/components/admin/admin-mobile-navigation";
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
  const adminInitials = adminName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

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
          <div className="admin-account-summary">
            <span aria-hidden="true">{adminInitials || "AD"}</span>
            <div>
              <p>Administrator</p>
              <strong>{adminName}</strong>
            </div>
          </div>
          <form action={endAdminSession}>
            <button type="submit">
              <span>Sign out</span>
              <i aria-hidden="true">↗</i>
            </button>
          </form>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <Link className="admin-mobile-brand" href="/admin/dashboard">
            <span>
              <Image src="/logos/cws_logo_mark.png" alt="" width={460} height={383} sizes="30px" />
            </span>
            <strong>CODEwithSleek</strong>
          </Link>
          <AdminMobileNavigation adminName={adminName} items={adminNavigation} />
          <Link className="admin-live-site" href="/" target="_blank">
            View live site <span aria-hidden="true">↗</span>
          </Link>
        </header>
        {children}
      </div>
    </div>
  );
}
