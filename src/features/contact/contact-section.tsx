import { getSiteSettings } from "@/features/settings/queries";
import { ContactForm } from "./contact-form";

export async function ContactSection() {
  const settings = await getSiteSettings();
  return <section className="section contact-section" id="contact"><div className="container contact-grid"><div className="contact-copy"><p className="section-kicker">Start a conversation</p><h2>{settings.contactHeading}</h2><p>{settings.contactDescription}</p><dl><div><dt>Best fit</dt><dd>Product interfaces, frontend systems, and full-stack web applications.</dd></div><div><dt>Response</dt><dd>{settings.responseTime}</dd></div></dl></div><ContactForm /></div></section>;
}
