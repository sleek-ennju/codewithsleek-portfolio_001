"use client";

import { useActionState, useState } from "react";

import { createPerformanceAudit } from "./actions";
import type { AuditFormState } from "./schemas";

type AuditProject = { id: string; title: string; liveUrl: string | null; demoUrl: string | null };

export function AuditRunner({ projects, configured }: { projects: AuditProject[]; configured: boolean }) {
  const [state, action, pending] = useActionState(createPerformanceAudit, {} as AuditFormState);
  const [projectId, setProjectId] = useState(state.values?.projectId ?? projects[0]?.id ?? "");
  const selectedProject = projects.find((project) => project.id === projectId);
  const [testedUrl, setTestedUrl] = useState(state.values?.testedUrl ?? selectedProject?.liveUrl ?? selectedProject?.demoUrl ?? "");

  function selectProject(nextProjectId: string) {
    const project = projects.find((item) => item.id === nextProjectId);
    setProjectId(nextProjectId);
    setTestedUrl(project?.liveUrl ?? project?.demoUrl ?? "");
  }

  return <form action={action} className="admin-audit-form" noValidate>
    <div className="admin-form-grid">
      <label htmlFor="audit-project">Published project
        <select id="audit-project" name="projectId" value={projectId} onChange={(event) => selectProject(event.target.value)}>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
        </select>
        {state.errors?.projectId ? <span>{state.errors.projectId[0]}</span> : null}
      </label>
      <label htmlFor="audit-strategy">Test strategy
        <select defaultValue={state.values?.strategy ?? "MOBILE"} id="audit-strategy" name="strategy"><option value="MOBILE">Mobile</option><option value="DESKTOP">Desktop</option></select>
      </label>
      <label className="admin-form-wide" htmlFor="audit-url">Public URL
        <input id="audit-url" name="testedUrl" onChange={(event) => setTestedUrl(event.target.value)} placeholder="https://example.com" type="url" value={testedUrl} />
        {state.errors?.testedUrl ? <span>{state.errors.testedUrl[0]}</span> : <small>Use the exact production page whose evidence should be recorded.</small>}
      </label>
      {state.message ? <p className={`admin-feedback ${state.status === "success" ? "admin-feedback-success" : "admin-feedback-error"}`} aria-live="polite" role={state.status === "error" ? "alert" : "status"}>{state.message}</p> : null}
    </div>
    <div className="admin-form-actions"><button className="admin-primary-button" disabled={pending || !configured || projects.length === 0} type="submit">{pending ? "Running PageSpeed audit…" : "Run verified audit"}</button></div>
  </form>;
}
