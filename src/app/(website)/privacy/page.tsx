import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <main className="page-shell container prose-page">
      <p className="section-kicker">Privacy</p>
      <h1>Privacy notice</h1>
      <p>A complete privacy notice will be published before analytics, monitoring, or contact-form storage is enabled.</p>
    </main>
  );
}
