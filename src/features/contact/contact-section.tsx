import { ContactForm } from "./contact-form";

export function ContactSection() {
  return (
    <section className="section contact-section" id="contact">
      <div className="container contact-grid">
        <div className="contact-copy">
          <p className="section-kicker">Start a conversation</p>
          <h2>Have a product worth building properly?</h2>
          <p>Share the challenge, the outcome you want, and where things currently stand. I’ll reply with a clear next step.</p>
          <dl>
            <div><dt>Best fit</dt><dd>Product interfaces, frontend systems, and full-stack web applications.</dd></div>
            <div><dt>Response</dt><dd>Usually within two business days.</dd></div>
          </dl>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
