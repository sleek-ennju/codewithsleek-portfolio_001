"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { ActionNotification } from "@/components/admin/action-notification";

import type { ProjectFormState } from "@/features/projects/schemas";

type ProjectValues = {
  title?: string;
  slug?: string;
  shortSummary?: string;
  projectType?: string;
  industries?: string[] | string;
  year?: number | string;
  liveUrl?: string | null;
  demoUrl?: string | null;
  repositoryUrl?: string | null;
  repositoryVisible?: boolean;
  featured?: boolean;
  displayOrder?: number | string;
  overview?: string | null;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  cardImageId?: string | null;
  coverImageId?: string | null;
  socialImageId?: string | null;
  storyOverviewImageId?: string | null;
  storyFeatureImageId?: string | null;
  storyDetailImageId?: string | null;
  galleryImageIds?: string[];
  problem?: string | null;
  goals?: string | null;
  role?: string | null;
  approach?: string | null;
  challenges?: string | null;
  solutions?: string | null;
  outcome?: string | null;
  lessons?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  technologies?: string[] | string;
  metrics?: Array<{ label: string; value: string; unit: string | null }> | string;
};

type MediaOption = { id: string; fileName: string; secureUrl: string; altText: string | null };
type TechnologyOption = { id: string; name: string; category: string };

function TechnologyPicker({
  options,
  initialSelected,
}: {
  options: TechnologyOption[];
  initialSelected: string[];
}) {
  const [selected, setSelected] = useState(() => new Set(initialSelected));
  const categories = options
    .map((technology) => technology.category)
    .filter((category, index, list) => list.indexOf(category) === index);
  const toggle = (name: string, checked: boolean) =>
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(name);
      else next.delete(name);
      return next;
    });

  if (!options.length)
    return (
      <div className="admin-form-wide admin-technology-picker">
        <strong>Technologies</strong>
        <small>Add reusable technologies in the Technologies module first.</small>
      </div>
    );

  return (
    <div className="admin-form-wide admin-technology-picker">
      <div className="admin-technology-picker-heading">
        <div>
          <strong>Technologies</strong>
          <small>Select only the tools materially used in this project.</small>
        </div>
        <span>{selected.size} selected</span>
      </div>
      {selected.size > 0 && (
        <div className="admin-selected-technologies" aria-label="Selected technologies">
          {options
            .filter((technology) => selected.has(technology.name))
            .map((technology) => (
              <button
                key={technology.id}
                type="button"
                onClick={() => toggle(technology.name, false)}
                aria-label={`Remove ${technology.name}`}
              >
                <span>{technology.name}</span>
                <i aria-hidden="true">×</i>
              </button>
            ))}
        </div>
      )}
      <div className="admin-technology-picker-groups">
        {categories.map((category) => (
          <fieldset key={category}>
            <legend>{category}</legend>
            <div>
              {options
                .filter((technology) => technology.category === category)
                .map((technology) => (
                  <label key={technology.id}>
                    <input
                      name="technologies"
                      type="checkbox"
                      value={technology.name}
                      checked={selected.has(technology.name)}
                      onChange={(event) => toggle(technology.name, event.target.checked)}
                    />
                    <span>{technology.name}</span>
                  </label>
                ))}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

function StoryImagePicker({
  media,
  initialValues,
  error,
}: {
  media: MediaOption[];
  initialValues: [string, string, string];
  error?: string;
}) {
  const [selected, setSelected] = useState(initialValues);
  const frames = [
    {
      name: "storyOverviewImageId",
      title: "01 · Overview",
      description: "The clearest full-product view.",
    },
    {
      name: "storyFeatureImageId",
      title: "02 · Feature",
      description: "A defining workflow or capability.",
    },
    {
      name: "storyDetailImageId",
      title: "03 · Detail",
      description: "A closer interface or product detail.",
    },
  ] as const;
  return (
    <div className="admin-story-images">
      <div>
        <strong>Landing-page story</strong>
        <p>Choose the three ordered frames used by the featured-project scroll sequence.</p>
        {error && <span>{error}</span>}
      </div>
      <div className="admin-story-image-grid">
        {frames.map((frame, index) => {
          const asset = media.find((item) => item.id === selected[index]);
          return (
            <label key={frame.name}>
              <span>{frame.title}</span>
              <small>{frame.description}</small>
              <select
                name={frame.name}
                value={selected[index]}
                onChange={(event) =>
                  setSelected(
                    (current) =>
                      current.map((value, itemIndex) =>
                        itemIndex === index ? event.target.value : value,
                      ) as [string, string, string],
                  )
                }
              >
                <option value="">Use automatic fallback</option>
                {media.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.fileName}
                  </option>
                ))}
              </select>
              <span className="admin-story-image-preview">
                {asset ? (
                  <Image src={asset.secureUrl} alt={asset.altText ?? ""} fill sizes="260px" />
                ) : (
                  <i>Fallback preview</i>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function ProjectForm({
  action,
  values = {},
  media,
  technologyOptions = [],
}: {
  action: (state: ProjectFormState, data: FormData) => Promise<ProjectFormState>;
  values?: ProjectValues;
  media: MediaOption[];
  technologyOptions?: TechnologyOption[];
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const error = (name: string) => state.errors?.[name]?.[0];
  const activeValues = state.values ?? values;
  const industries = Array.isArray(activeValues.industries)
    ? activeValues.industries.join(", ")
    : activeValues.industries;
  const technologies = Array.isArray(activeValues.technologies)
    ? activeValues.technologies.join(", ")
    : activeValues.technologies;
  const selectedTechnologies = (technologies ?? "")
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean);
  const metrics = Array.isArray(activeValues.metrics)
    ? activeValues.metrics
        .map((metric) => [metric.label, metric.value, metric.unit].filter(Boolean).join(" | "))
        .join("\n")
    : activeValues.metrics;

  return (
    <form action={formAction} className="admin-project-form" key={state.submissionId ?? "initial"}>
      {state.message && (
        <ActionNotification
          key={state.submissionId ?? state.message}
          message={state.message}
          title="Project not saved"
          tone="error"
        />
      )}
      <div className="admin-form-grid">
        <label>
          Title
          <input name="title" defaultValue={activeValues.title} required />
          {error("title") && <span>{error("title")}</span>}
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={activeValues.slug} placeholder="project-name" required />
          {error("slug") && <span>{error("slug")}</span>}
        </label>
        <label className="admin-form-wide">
          Short summary
          <textarea
            name="shortSummary"
            defaultValue={activeValues.shortSummary}
            rows={3}
            required
          />
          {error("shortSummary") && <span>{error("shortSummary")}</span>}
        </label>
        <label>
          Project type
          <input
            name="projectType"
            defaultValue={activeValues.projectType}
            placeholder="Web application"
            required
          />
        </label>
        <label>
          Year
          <input
            name="year"
            type="number"
            min="2000"
            max="2100"
            defaultValue={activeValues.year ?? new Date().getFullYear()}
            required
          />
        </label>
        <label className="admin-form-wide">
          Industries
          <input name="industries" defaultValue={industries} placeholder="Fintech, SaaS" />
          <small>Separate multiple industries with commas.</small>
        </label>
        <label>
          Live URL
          <input name="liveUrl" type="url" defaultValue={activeValues.liveUrl ?? ""} />
        </label>
        <label>
          Demo URL
          <input name="demoUrl" type="url" defaultValue={activeValues.demoUrl ?? ""} />
        </label>
        <label className="admin-form-wide">
          Repository URL
          <input name="repositoryUrl" type="url" defaultValue={activeValues.repositoryUrl ?? ""} />
          {error("repositoryUrl") && <span>{error("repositoryUrl")}</span>}
          <small>Stored privately unless “Show repository publicly” is enabled.</small>
        </label>
        <label className="admin-checkbox">
          <input
            name="repositoryVisible"
            type="checkbox"
            defaultChecked={activeValues.repositoryVisible}
          />
          Show repository publicly
        </label>
        <label className="admin-checkbox">
          <input name="featured" type="checkbox" defaultChecked={activeValues.featured} />
          Featured project
        </label>
        <label>
          Homepage order
          <input
            name="displayOrder"
            type="number"
            min="0"
            max="999"
            defaultValue={activeValues.displayOrder ?? 0}
          />
          <small>Lower numbers appear first.</small>
        </label>
        <label className="admin-form-wide">
          Overview
          <textarea name="overview" defaultValue={activeValues.overview ?? ""} rows={8} />
          {error("overview") && <span>{error("overview")}</span>}
        </label>
        <fieldset className="admin-form-wide admin-case-study-fields">
          <legend>Case study narrative</legend>
          <div className="admin-form-grid">
            <label className="admin-form-wide">
              Problem
              <textarea name="problem" defaultValue={activeValues.problem ?? ""} rows={5} />
              {error("problem") && <span>{error("problem")}</span>}
            </label>
            <label className="admin-form-wide">
              Goals
              <textarea name="goals" defaultValue={activeValues.goals ?? ""} rows={4} />
            </label>
            <label className="admin-form-wide">
              Your role
              <textarea name="role" defaultValue={activeValues.role ?? ""} rows={4} />
            </label>
            <label className="admin-form-wide">
              Approach
              <textarea name="approach" defaultValue={activeValues.approach ?? ""} rows={5} />
            </label>
            <label className="admin-form-wide">
              Challenges
              <textarea name="challenges" defaultValue={activeValues.challenges ?? ""} rows={5} />
            </label>
            <label className="admin-form-wide">
              Solutions
              <textarea name="solutions" defaultValue={activeValues.solutions ?? ""} rows={5} />
              {error("solutions") && <span>{error("solutions")}</span>}
            </label>
            <label className="admin-form-wide">
              Outcome
              <textarea name="outcome" defaultValue={activeValues.outcome ?? ""} rows={5} />
              {error("outcome") && <span>{error("outcome")}</span>}
            </label>
            <label className="admin-form-wide">
              Lessons learned
              <textarea name="lessons" defaultValue={activeValues.lessons ?? ""} rows={4} />
            </label>
          </div>
        </fieldset>
        <fieldset className="admin-form-wide admin-case-study-fields">
          <legend>Evidence and discoverability</legend>
          <div className="admin-form-grid">
            <TechnologyPicker options={technologyOptions} initialSelected={selectedTechnologies} />
            <label className="admin-form-wide">
              Metrics
              <textarea
                name="metrics"
                defaultValue={metrics ?? ""}
                rows={5}
                placeholder={"Performance score | 98 | /100\nConversion increase | 24 | %"}
              />
              {error("metrics") && <span>{error("metrics")}</span>}
              <small>One per line: Label | Value | Unit (unit is optional).</small>
            </label>
            <label>
              SEO title
              <input name="seoTitle" defaultValue={activeValues.seoTitle ?? ""} maxLength={70} />
            </label>
            <label>
              SEO description
              <textarea
                name="seoDescription"
                defaultValue={activeValues.seoDescription ?? ""}
                maxLength={160}
                rows={3}
              />
            </label>
          </div>
        </fieldset>
        <fieldset className="admin-form-wide admin-media-roles">
          <legend>Project imagery</legend>
          <div className="admin-form-grid">
            <label>
              Card image
              <select name="cardImageId" defaultValue={activeValues.cardImageId ?? ""}>
                <option value="">No card image</option>
                {media.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.fileName}
                  </option>
                ))}
              </select>
              {error("cardImageId") && <span>{error("cardImageId")}</span>}
            </label>
            <label>
              Cover image
              <select name="coverImageId" defaultValue={activeValues.coverImageId ?? ""}>
                <option value="">No cover image</option>
                {media.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.fileName}
                  </option>
                ))}
              </select>
              {error("coverImageId") && <span>{error("coverImageId")}</span>}
            </label>
            <label>
              Social image
              <select name="socialImageId" defaultValue={activeValues.socialImageId ?? ""}>
                <option value="">No social image</option>
                {media.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.fileName}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <StoryImagePicker
            media={media}
            initialValues={[
              activeValues.storyOverviewImageId ?? "",
              activeValues.storyFeatureImageId ?? "",
              activeValues.storyDetailImageId ?? "",
            ]}
            error={error("storyOverviewImageId")}
          />
          <p>Select gallery images. Their current visual order follows the media library order.</p>
          {media.length === 0 ? (
            <small>Upload images in Media before assigning project imagery.</small>
          ) : (
            <div className="admin-project-media-grid">
              {media.map((asset) => (
                <label key={asset.id}>
                  <input
                    name="galleryImageIds"
                    type="checkbox"
                    value={asset.id}
                    defaultChecked={activeValues.galleryImageIds?.includes(asset.id)}
                  />
                  <span className="admin-project-media-thumb">
                    <Image src={asset.secureUrl} alt={asset.altText ?? ""} fill sizes="140px" />
                  </span>
                  <span>{asset.fileName}</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>
        <label>
          Status
          <select name="status" defaultValue={activeValues.status ?? "DRAFT"}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived / hidden</option>
          </select>
        </label>
      </div>
      <div className="admin-form-actions">
        <button
          className={`admin-primary-button${pending ? " admin-button-loading" : ""}`}
          disabled={pending}
          type="submit"
        >
          {pending ? "Saving…" : "Save project"}
        </button>
      </div>
    </form>
  );
}
