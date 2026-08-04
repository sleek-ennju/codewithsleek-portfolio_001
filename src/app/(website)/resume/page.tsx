import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Résumé" };

export default function ResumePage() {
  return (
    <main className="page-shell container">
      <p className="section-kicker">Résumé</p>
      <h1>The final résumé will be available here.</h1>
      <p>This route is intentionally ready without shipping the UI-design PDF or execution plan as a résumé.</p>
      <Link className="text-link" href="/">Return home</Link>
    </main>
  );
}
