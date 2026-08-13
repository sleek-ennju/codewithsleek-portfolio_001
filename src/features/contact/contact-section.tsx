import { getSiteSettings } from "@/features/settings/queries";
import { ContactForm } from "./contact-form";

export async function ContactSection() {
  const settings = await getSiteSettings();
  return <section className="section contact-section" id="contact"><div className="container contact-grid"><div className="contact-copy"><p className="section-kicker">Start a conversation</p><h2>{settings.contactHeading}</h2><p>{settings.contactDescription}</p><dl><div><dt>01 / Best fit</dt><dd>Product interfaces, frontend systems, and full-stack web applications.</dd></div><div><dt>02 / Response</dt><dd>{settings.responseTime}</dd></div></dl><p className="contact-direct">Prefer email? <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></p></div><ContactForm /></div></section>;
}
