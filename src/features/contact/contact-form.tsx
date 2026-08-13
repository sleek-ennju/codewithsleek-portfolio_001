"use client";

import { useActionState } from "react";

import { submitContactForm } from "./actions";
import { ContactNotification } from "./contact-notification";
import type { ContactFormState } from "./schemas";

const initialState: ContactFormState = {};

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContactForm, initialState);
  const values = state.status === "success" ? undefined : state.values;

  return (
    <form action={action} className="contact-form" key={state.status === "success" ? state.submissionId : "contact-form"} noValidate>
      <div className="contact-form-heading"><div><span>Project brief</span><strong>A few details to get us aligned.</strong></div><small>01 — 03</small></div>
      <div className="contact-field-row">
        <label htmlFor="contact-name">
          Name
          <input aria-describedby={state.errors?.name ? "contact-name-error" : undefined} aria-invalid={Boolean(state.errors?.name)} autoComplete="name" defaultValue={values?.name} id="contact-name" name="name" required type="text" />
          {state.errors?.name ? <span id="contact-name-error">{state.errors.name[0]}</span> : null}
        </label>
        <label htmlFor="contact-email">
          Email
          <input aria-describedby={state.errors?.email ? "contact-email-error" : undefined} aria-invalid={Boolean(state.errors?.email)} autoComplete="email" defaultValue={values?.email} id="contact-email" name="email" required type="email" />
          {state.errors?.email ? <span id="contact-email-error">{state.errors.email[0]}</span> : null}
        </label>
      </div>

      <label htmlFor="contact-message">
        Tell me about the project
        <textarea aria-describedby={state.errors?.message ? "contact-message-error" : "contact-message-help"} aria-invalid={Boolean(state.errors?.message)} defaultValue={values?.message} id="contact-message" maxLength={3000} name="message" required rows={7} />
        {state.errors?.message ? <span id="contact-message-error">{state.errors.message[0]}</span> : <small id="contact-message-help">Goals, timeline, constraints—anything that helps frame the work.</small>}
      </label>

      <label className="contact-honeypot" aria-hidden="true">
        Company website
        <input autoComplete="off" name="companyWebsite" tabIndex={-1} type="text" />
      </label>

      {state.status === "error" && state.message ? <p className="contact-feedback contact-feedback-error" aria-live="polite" role="alert">{state.message}</p> : null}
      {state.status === "success" && state.message ? <ContactNotification key={state.submissionId} message={state.message} /> : null}

      <button className="button button-dark" disabled={pending} type="submit">
        {pending ? "Sending…" : "Send project enquiry"}<span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
