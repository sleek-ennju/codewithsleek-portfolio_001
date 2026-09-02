"use client";

import { useActionState } from "react";

import { ActionNotification } from "@/components/admin/action-notification";
import {
  createTechnology,
  deleteTechnology,
  moveTechnology,
  syncTechnologyLibrary,
  updateTechnology,
} from "@/features/technologies/actions";
import { TECHNOLOGY_CATEGORIES } from "@/features/technologies/library";
import type { TechnologyFormState, TechnologySyncState } from "@/features/technologies/schemas";

type Technology = {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  projectCount: number;
};

function Fields({ technology, state }: { technology?: Technology; state: TechnologyFormState }) {
  const active = state.values ?? technology ?? { name: "", category: "", icon: "" };
  const legacyCategory =
    active.category &&
    !TECHNOLOGY_CATEGORIES.includes(active.category as (typeof TECHNOLOGY_CATEGORIES)[number]);
  return (
    <>
      <label>
        Name
        <input name="name" defaultValue={active.name} placeholder="Next.js" required />
        {state.errors?.name?.[0] && <span>{state.errors.name[0]}</span>}
      </label>
      <label>
        Category
        <select name="category" defaultValue={active.category} required>
          <option value="" disabled>
            Select a category
          </option>
          {legacyCategory && (
            <option value={active.category} disabled>
              {active.category} — choose a current category
            </option>
          )}
          {TECHNOLOGY_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {state.errors?.category?.[0] && <span>{state.errors.category[0]}</span>}
      </label>
      <label className="admin-form-wide">
        Icon reference <span>(optional)</span>
        <input
          name="icon"
          defaultValue={active.icon ?? ""}
          placeholder="A short icon key or asset reference"
        />
        <small>Reserved for the branded technology icon system.</small>
      </label>
    </>
  );
}

function TechnologyCard({
  technology,
  index,
  count,
}: {
  technology: Technology;
  index: number;
  count: number;
}) {
  const [editState, editAction, editPending] = useActionState(
    updateTechnology.bind(null, technology.id),
    {},
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteTechnology.bind(null, technology.id),
    {},
  );
  return (
    <article className="admin-technology-card">
      <header>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div>
          <strong>{technology.name}</strong>
          <small>
            {technology.category} · {technology.projectCount} project
            {technology.projectCount === 1 ? "" : "s"}
          </small>
        </div>
        <div className="admin-order-actions">
          <form action={moveTechnology.bind(null, technology.id, "up")}>
            <button disabled={index === 0}>Up</button>
          </form>
          <form action={moveTechnology.bind(null, technology.id, "down")}>
            <button disabled={index === count - 1}>Down</button>
          </form>
        </div>
      </header>
      <details>
        <summary>Edit technology</summary>
        <form
          action={editAction}
          className="admin-form-grid"
          key={editState.submissionId ?? technology.id}
        >
          {editState.message && (
            <ActionNotification
              key={editState.submissionId ?? editState.message}
              message={editState.message}
              title={editState.tone === "error" ? "Technology not updated" : "Technology updated"}
              tone={editState.tone ?? (editState.errors ? "error" : "success")}
            />
          )}
          <Fields technology={technology} state={editState} />
          <div className="admin-form-actions admin-form-wide">
            <button className="admin-primary-button" disabled={editPending}>
              {editPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </details>
      <details className="admin-section-delete">
        <summary>Remove technology</summary>
        <p>
          {technology.projectCount
            ? "This technology must be removed from every project first."
            : "This permanently removes the reusable technology record."}
        </p>
        <form action={deleteAction}>
          {deleteState.message && (
            <ActionNotification
              key={deleteState.submissionId ?? deleteState.message}
              message={deleteState.message}
              title={
                deleteState.tone === "success" ? "Technology removed" : "Technology not removed"
              }
              tone={deleteState.tone ?? "error"}
            />
          )}
          <button className="admin-danger-button" disabled={deletePending}>
            {deletePending ? "Removing..." : "Confirm removal"}
          </button>
        </form>
      </details>
    </article>
  );
}

export function TechnologyManager({ technologies }: { technologies: Technology[] }) {
  const [state, action, pending] = useActionState(createTechnology, {});
  const [syncState, syncAction, syncPending] = useActionState<TechnologySyncState, FormData>(
    syncTechnologyLibrary,
    {},
  );
  const categories = [
    ...TECHNOLOGY_CATEGORIES,
    ...technologies
      .map((technology) => technology.category)
      .filter(
        (category, index, list) =>
          !TECHNOLOGY_CATEGORIES.includes(category as (typeof TECHNOLOGY_CATEGORIES)[number]) &&
          list.indexOf(category) === index,
      ),
  ];
  return (
    <div className="admin-technology-manager">
      <section className="admin-panel admin-technology-sync">
        <div>
          <p className="admin-eyebrow">Curated foundation</p>
          <h2>Reusable technology library</h2>
          <p>
            Synchronize the complete Code with Sleek tool library without deleting custom
            technologies or changing any project assignments.
          </p>
        </div>
        <form action={syncAction}>
          <button className="admin-primary-button" disabled={syncPending}>
            {syncPending ? "Synchronizing..." : "Sync complete library"}
          </button>
        </form>
        {syncState.message && (
          <ActionNotification
            key={syncState.submissionId ?? syncState.message}
            message={syncState.message}
            title={syncState.tone === "error" ? "Library sync failed" : "Library synchronized"}
            tone={syncState.tone ?? "error"}
          />
        )}
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Reusable stack</p>
            <h2>Add technology</h2>
          </div>
          <span>{technologies.length} total</span>
        </div>
        <form
          action={action}
          className="admin-form-grid admin-technology-create"
          key={state.submissionId ?? "new-technology"}
        >
          {state.message && (
            <ActionNotification
              key={state.submissionId ?? state.message}
              message={state.message}
              title={state.tone === "error" ? "Technology not added" : "Technology added"}
              tone={state.tone ?? (state.errors ? "error" : "success")}
            />
          )}
          <Fields state={state} />
          <div className="admin-form-actions admin-form-wide">
            <button className="admin-primary-button" disabled={pending}>
              {pending ? "Adding..." : "Add technology"}
            </button>
          </div>
        </form>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Organized selection</p>
            <h2>Technology library</h2>
          </div>
        </div>
        {technologies.length ? (
          <div className="admin-technology-groups">
            {categories.map((category) => {
              const items = technologies.filter((technology) => technology.category === category);
              if (!items.length) return null;
              return (
                <section key={category} className="admin-technology-group">
                  <header>
                    <div>
                      <span>{category}</span>
                      <strong>{items.length}</strong>
                    </div>
                    <p>Reusable across every case study.</p>
                  </header>
                  <div className="admin-technology-list">
                    {items.map((technology, index) => (
                      <TechnologyCard
                        count={items.length}
                        index={index}
                        key={technology.id}
                        technology={technology}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="admin-empty-state">
            <strong>No technologies yet.</strong>
            <p>Synchronize the curated library or add the first reusable stack entry above.</p>
          </div>
        )}
      </section>
    </div>
  );
}
