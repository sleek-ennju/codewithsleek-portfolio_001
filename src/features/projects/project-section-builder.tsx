"use client";

import { useActionState } from "react";
import { ActionNotification } from "@/components/admin/action-notification";
import {
  createProjectSection,
  deleteProjectSection,
  moveProjectSection,
  updateProjectSection,
} from "@/features/projects/actions";
import type { ProjectSectionFormState } from "@/features/projects/schemas";

type SectionType = "RICH_TEXT" | "QUOTE" | "CODE_SAMPLE" | "TWO_COLUMN" | "METRICS_GRID";
type Section = { id: string; type: string; title: string | null; content: unknown };
const labels: Record<SectionType, string> = {
  RICH_TEXT: "Rich text",
  QUOTE: "Quote",
  CODE_SAMPLE: "Code sample",
  TWO_COLUMN: "Two columns",
  METRICS_GRID: "Metrics grid",
};

function isEditableType(type: string): type is SectionType {
  return type in labels;
}

function readValues(section?: Section) {
  const content = (
    section?.content && typeof section.content === "object" ? section.content : {}
  ) as Record<string, unknown>;
  const metrics = Array.isArray(content.metrics)
    ? content.metrics
        .map((item) => {
          const metric = item as Record<string, unknown>;
          return [metric.label, metric.value, metric.unit].filter(Boolean).join(" | ");
        })
        .join("\n")
    : "";
  return {
    type: section && isEditableType(section.type) ? section.type : "RICH_TEXT",
    title: section?.title ?? "",
    primary: String(content.text ?? content.quote ?? content.code ?? content.left ?? metrics),
    secondary: String(content.attribution ?? content.language ?? content.right ?? ""),
  };
}

function Fields({
  initial,
  state,
}: {
  initial: ReturnType<typeof readValues>;
  state: ProjectSectionFormState;
}) {
  const active = state.values ?? initial;
  const error = (name: string) => state.errors?.[name]?.[0];
  return (
    <>
      <label>
        Block type
        <select name="type" defaultValue={active.type}>
          {Object.entries(labels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Heading <span>(optional)</span>
        <input name="title" defaultValue={active.title} maxLength={120} />
      </label>
      <label className="admin-form-wide">
        Primary content
        <textarea name="primary" defaultValue={active.primary} rows={6} required />
        {error("primary") && <span>{error("primary")}</span>}
        <small>For metrics, use: Label | Value | Unit, one item per line.</small>
      </label>
      <label className="admin-form-wide">
        Secondary content <span>(right column, attribution, or code language)</span>
        <textarea name="secondary" defaultValue={active.secondary} rows={3} />
        {error("secondary") && <span>{error("secondary")}</span>}
      </label>
    </>
  );
}

function ExistingSection({
  projectId,
  section,
  index,
  count,
}: {
  projectId: string;
  section: Section;
  index: number;
  count: number;
}) {
  const [state, formAction, pending] = useActionState(
    updateProjectSection.bind(null, projectId, section.id),
    {},
  );
  const sectionLabel = isEditableType(section.type)
    ? labels[section.type]
    : section.type.replaceAll("_", " ").toLowerCase();
  return (
    <article className="admin-section-card">
      <div className="admin-section-card-heading">
        <div>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{section.title || sectionLabel}</strong>
          <small>{sectionLabel}</small>
        </div>
        <div>
          <form action={moveProjectSection.bind(null, projectId, section.id, "up")}>
            <button disabled={index === 0} aria-label="Move section up">
              Up
            </button>
          </form>
          <form action={moveProjectSection.bind(null, projectId, section.id, "down")}>
            <button disabled={index === count - 1} aria-label="Move section down">
              Down
            </button>
          </form>
        </div>
      </div>
      {isEditableType(section.type) ? (
        <details>
          <summary>Edit section</summary>
          <form
            action={formAction}
            className="admin-form-grid"
            key={state.submissionId ?? section.id}
          >
            {state.message && (
              <ActionNotification
                key={state.submissionId ?? state.message}
                message={state.message}
                title={state.errors ? "Section not saved" : "Section saved"}
                tone={state.errors ? "error" : "success"}
              />
            )}
            <Fields initial={readValues(section)} state={state} />
            <div className="admin-form-actions admin-form-wide">
              <button
                className={`admin-primary-button${pending ? " admin-button-loading" : ""}`}
                disabled={pending}
              >
                {pending ? "Saving..." : "Save section"}
              </button>
            </div>
          </form>
        </details>
      ) : (
        <p className="admin-section-notice">
          This media block remains ordered and removable, but editing will be added with the media
          block controls.
        </p>
      )}
      <details className="admin-section-delete">
        <summary>Remove section</summary>
        <p>This permanently removes the block from the case study.</p>
        <form action={deleteProjectSection.bind(null, projectId, section.id)}>
          <button className="admin-danger-button">Confirm removal</button>
        </form>
      </details>
    </article>
  );
}

export function ProjectSectionBuilder({
  projectId,
  sections,
}: {
  projectId: string;
  sections: Section[];
}) {
  const [state, formAction, pending] = useActionState(
    createProjectSection.bind(null, projectId),
    {},
  );
  return (
    <section className="admin-section-builder">
      <div className="admin-section-builder-heading">
        <div>
          <p className="admin-eyebrow">Structured case study</p>
          <h2>Content sections</h2>
          <p>Build ordered, reusable blocks without project-specific JSX.</p>
        </div>
        <span>
          {sections.length} {sections.length === 1 ? "section" : "sections"}
        </span>
      </div>
      {sections.length ? (
        <div className="admin-section-list">
          {sections.map((section, index) => (
            <ExistingSection
              count={sections.length}
              index={index}
              key={section.id}
              projectId={projectId}
              section={section}
            />
          ))}
        </div>
      ) : (
        <div className="admin-empty-state">
          <strong>No structured sections yet.</strong>
          <p>The existing narrative continues to render while you build this sequence.</p>
        </div>
      )}
      <details className="admin-add-section">
        <summary>Add content section</summary>
        <form
          action={formAction}
          className="admin-form-grid"
          key={state.submissionId ?? "new-section"}
        >
          {state.message && (
            <ActionNotification
              key={state.submissionId ?? state.message}
              message={state.message}
              title={state.errors ? "Section not added" : "Section added"}
              tone={state.errors ? "error" : "success"}
            />
          )}
          <Fields initial={readValues()} state={state} />
          <div className="admin-form-actions admin-form-wide">
            <button
              className={`admin-primary-button${pending ? " admin-button-loading" : ""}`}
              disabled={pending}
            >
              {pending ? "Adding..." : "Add section"}
            </button>
          </div>
        </form>
      </details>
    </section>
  );
}
