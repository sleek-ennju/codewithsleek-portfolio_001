"use client";

import { useActionState } from "react";

import { createTechnology, deleteTechnology, moveTechnology, updateTechnology } from "@/features/technologies/actions";
import type { TechnologyFormState } from "@/features/technologies/schemas";

type Technology = { id: string; name: string; category: string; icon: string | null; projectCount: number };

function Fields({ technology, state }: { technology?: Technology; state: TechnologyFormState }) {
  const active = state.values ?? technology ?? { name: "", category: "", icon: "" };
  return <>
    <label>Name<input name="name" defaultValue={active.name} placeholder="Next.js" required />{state.errors?.name?.[0] && <span>{state.errors.name[0]}</span>}</label>
    <label>Category<input name="category" defaultValue={active.category} placeholder="Frontend" required />{state.errors?.category?.[0] && <span>{state.errors.category[0]}</span>}</label>
    <label className="admin-form-wide">Icon reference <span>(optional)</span><input name="icon" defaultValue={active.icon ?? ""} placeholder="A short icon key or asset reference" /><small>Reserved for the branded technology icon system.</small></label>
  </>;
}

function TechnologyCard({ technology, index, count }: { technology: Technology; index: number; count: number }) {
  const [editState, editAction, editPending] = useActionState(updateTechnology.bind(null, technology.id), {});
  const [deleteState, deleteAction, deletePending] = useActionState(deleteTechnology.bind(null, technology.id), {});
  return <article className="admin-technology-card">
    <header>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <div><strong>{technology.name}</strong><small>{technology.category} · {technology.projectCount} project{technology.projectCount === 1 ? "" : "s"}</small></div>
      <div className="admin-order-actions"><form action={moveTechnology.bind(null, technology.id, "up")}><button disabled={index === 0}>Up</button></form><form action={moveTechnology.bind(null, technology.id, "down")}><button disabled={index === count - 1}>Down</button></form></div>
    </header>
    <details><summary>Edit technology</summary><form action={editAction} className="admin-form-grid" key={editState.submissionId ?? technology.id}>{editState.message && <p className={editState.errors ? "admin-form-error admin-form-wide" : "admin-form-success admin-form-wide"} aria-live="polite">{editState.message}</p>}<Fields technology={technology} state={editState} /><div className="admin-form-actions admin-form-wide"><button className="admin-primary-button" disabled={editPending}>{editPending ? "Saving..." : "Save changes"}</button></div></form></details>
    <details className="admin-section-delete"><summary>Remove technology</summary><p>{technology.projectCount ? "This technology must be removed from every project first." : "This permanently removes the reusable technology record."}</p><form action={deleteAction}>{deleteState.message && <p className="admin-form-error" aria-live="polite">{deleteState.message}</p>}<button className="admin-danger-button" disabled={deletePending}>{deletePending ? "Removing..." : "Confirm removal"}</button></form></details>
  </article>;
}

export function TechnologyManager({ technologies }: { technologies: Technology[] }) {
  const [state, action, pending] = useActionState(createTechnology, {});
  return <div className="admin-technology-manager">
    <section className="admin-panel">
      <div className="admin-panel-heading"><div><p className="admin-eyebrow">Reusable stack</p><h2>Add technology</h2></div><span>{technologies.length} total</span></div>
      <form action={action} className="admin-form-grid admin-technology-create" key={state.submissionId ?? "new-technology"}>{state.message && <p className={state.errors ? "admin-form-error admin-form-wide" : "admin-form-success admin-form-wide"} aria-live="polite">{state.message}</p>}<Fields state={state} /><div className="admin-form-actions admin-form-wide"><button className="admin-primary-button" disabled={pending}>{pending ? "Adding..." : "Add technology"}</button></div></form>
    </section>
    <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Display sequence</p><h2>Technology library</h2></div></div>{technologies.length ? <div className="admin-technology-list">{technologies.map((technology, index) => <TechnologyCard count={technologies.length} index={index} key={technology.id} technology={technology} />)}</div> : <div className="admin-empty-state"><strong>No technologies yet.</strong><p>Add the first reusable stack entry above.</p></div>}</section>
  </div>;
}
