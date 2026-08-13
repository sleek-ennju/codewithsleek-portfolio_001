import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInForm } from "@/features/auth/sign-in-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administrator sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user.role === "ADMIN") redirect("/admin/dashboard");

  return (
    <main className="admin-login-page">
      <div className="admin-login-panel">
        <Link className="admin-login-brand" href="/" aria-label="CODEwithSleek home"><Image src="/logos/cws_logo_wordmark.png" alt="CODEwithSleek — Crafting logic the sleek way" width={1300} height={683} priority sizes="180px" /></Link>
        <p className="admin-eyebrow">Private administration</p>
        <h1>Welcome back.</h1>
        <p className="admin-login-copy">Sign in to manage projects, evidence, media, and the public portfolio.</p>
        <SignInForm />
        <p className="admin-login-note">No public registration is available.</p>
      </div>
      <aside className="admin-login-aside" aria-hidden="true">
        <div className="admin-login-grid" />
        <p>Crafting logic,<br /><strong>the sleek way.</strong></p>
      </aside>
    </main>
  );
}
