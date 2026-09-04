"use client";

import { useActionState } from "react";
import { ActionNotification } from "@/components/admin/action-notification";
import {
  createTestimonial,
  deleteTestimonial,
  moveTestimonial,
  updateTestimonial,
} from "@/features/testimonials/actions";
import type { TestimonialFormState } from "@/features/testimonials/schemas";

type Option = { id: string; label: string };
type Testimonial = {
  id: string;
  authorName: string;
  authorRole: string;
  quote: string;
  published: boolean;
  featured: boolean;
  clientName: string;
  projectId: string | null;
  photoId: string | null;
};

function Fields({
  item,
  state,
  projects,
  photos,
}: {
  item?: Testimonial;
  state: TestimonialFormState;
  projects: Option[];
  photos: Option[];
}) {
  const active = state.values ?? item ?? {};
  const value = (key: string) => String(active[key as keyof typeof active] ?? "");
  const checked = (key: string) => Boolean(active[key as keyof typeof active]);
  const error = (key: string) => state.errors?.[key]?.[0];
  return (
    <>
      <label>
        Client name
        <input name="authorName" defaultValue={value("authorName")} required />
        {error("authorName") && <span>{error("authorName")}</span>}
      </label>
      <label>
        Role
        <input name="authorRole" defaultValue={value("authorRole")} required />
        {error("authorRole") && <span>{error("authorRole")}</span>}
      </label>
      <label className="admin-form-wide">
        Company or organisation
        <input name="clientName" defaultValue={value("clientName")} required />
        {error("clientName") && <span>{error("clientName")}</span>}
      </label>
      <label className="admin-form-wide">
        Testimonial
        <textarea name="quote" defaultValue={value("quote")} rows={6} required />
        {error("quote") && <span>{error("quote")}</span>}
      </label>
      <label>
        Related project
        <select name="projectId" defaultValue={value("projectId")}>
          <option value="">No project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Client photo
        <select name="photoId" defaultValue={value("photoId")}>
          <option value="">No photo</option>
          {photos.map((photo) => (
            <option key={photo.id} value={photo.id}>
              {photo.label}
            </option>
          ))}
        </select>
      </label>
      <label className="admin-checkbox">
        <input name="published" type="checkbox" defaultChecked={checked("published")} />
        Published publicly
      </label>
      <label className="admin-checkbox">
        <input name="featured" type="checkbox" defaultChecked={checked("featured")} />
        Featured on homepage
      </label>
    </>
  );
}

function Card({
  item,
  index,
  count,
  projects,
  photos,
}: {
  item: Testimonial;
  index: number;
  count: number;
  projects: Option[];
  photos: Option[];
}) {
  const [state, action, pending] = useActionState(updateTestimonial.bind(null, item.id), {});
  const [deleteState, deleteAction, deleting] = useActionState(
    deleteTestimonial.bind(null, item.id),
    {},
  );
  return (
    <article className="admin-testimonial-card">
      <header>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div>
          <strong>{item.authorName}</strong>
          <small>
            {item.authorRole} · {item.clientName}
          </small>
        </div>
        <div>
          <span className={`admin-status ${item.published ? "admin-status-published" : ""}`}>
            {item.published ? "Published" : "Draft"}
          </span>
          {item.featured && <span className="admin-status">Featured</span>}
        </div>
      </header>
      <blockquote>“{item.quote}”</blockquote>
      <div className="admin-order-actions">
        <form action={moveTestimonial.bind(null, item.id, "up")}>
          <button disabled={index === 0}>Up</button>
        </form>
        <form action={moveTestimonial.bind(null, item.id, "down")}>
          <button disabled={index === count - 1}>Down</button>
        </form>
      </div>
      <details>
        <summary>Edit testimonial</summary>
        <form action={action} className="admin-form-grid" key={state.submissionId ?? item.id}>
          {state.message && (
            <ActionNotification
              key={state.submissionId ?? state.message}
              message={state.message}
              title={state.errors ? "Testimonial not saved" : "Testimonial saved"}
              tone={state.errors ? "error" : "success"}
            />
          )}
          <Fields item={item} state={state} projects={projects} photos={photos} />
          <div className="admin-form-actions admin-form-wide">
            <button
              className={`admin-primary-button${pending ? " admin-button-loading" : ""}`}
              disabled={pending}
            >
              {pending ? "Saving..." : "Save testimonial"}
            </button>
          </div>
        </form>
      </details>
      <details className="admin-section-delete">
        <summary>Remove testimonial</summary>
        <p>This permanently removes this social-proof record.</p>
        <form action={deleteAction}>
          {deleteState.message && (
            <ActionNotification
              key={deleteState.submissionId ?? deleteState.message}
              message={deleteState.message}
              title="Testimonial not removed"
              tone="error"
            />
          )}
          <button
            className={`admin-danger-button${deleting ? " admin-button-loading" : ""}`}
            disabled={deleting}
          >
            {deleting ? "Removing..." : "Confirm removal"}
          </button>
        </form>
      </details>
    </article>
  );
}

export function TestimonialManager({
  testimonials,
  projects,
  photos,
}: {
  testimonials: Testimonial[];
  projects: Option[];
  photos: Option[];
}) {
  const [state, action, pending] = useActionState(createTestimonial, {});
  return (
    <div className="admin-testimonial-manager">
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Social proof</p>
            <h2>Add testimonial</h2>
          </div>
          <span>{testimonials.length} total</span>
        </div>
        <form
          action={action}
          className="admin-form-grid admin-testimonial-create"
          key={state.submissionId ?? "new"}
        >
          {state.message && (
            <ActionNotification
              key={state.submissionId ?? state.message}
              message={state.message}
              title={state.errors ? "Testimonial not added" : "Testimonial added"}
              tone={state.errors ? "error" : "success"}
            />
          )}
          <Fields state={state} projects={projects} photos={photos} />
          <div className="admin-form-actions admin-form-wide">
            <button
              className={`admin-primary-button${pending ? " admin-button-loading" : ""}`}
              disabled={pending}
            >
              {pending ? "Adding..." : "Add testimonial"}
            </button>
          </div>
        </form>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Publishing sequence</p>
            <h2>Testimonial library</h2>
          </div>
        </div>
        {testimonials.length ? (
          <div className="admin-testimonial-list">
            {testimonials.map((item, index) => (
              <Card
                count={testimonials.length}
                index={index}
                item={item}
                key={item.id}
                photos={photos}
                projects={projects}
              />
            ))}
          </div>
        ) : (
          <div className="admin-empty-state">
            <strong>No testimonials yet.</strong>
            <p>Add the first client story above.</p>
          </div>
        )}
      </section>
    </div>
  );
}
