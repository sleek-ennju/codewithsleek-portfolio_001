"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { ActionNotification } from "@/components/admin/action-notification";

type Asset = {
  id: string;
  secureUrl: string;
  altText: string | null;
  fileName: string;
  width: number | null;
  height: number | null;
  bytes: number;
};

export function MediaManager({ assets, configured }: { assets: Asset[]; configured: boolean }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    title: string;
    text: string;
  } | null>(null);
  const uploadFormRef = useRef<HTMLFormElement>(null);
  const [uploadPending, setUploadPending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function upload(formData: FormData) {
    setUploadPending(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: formData });
      const result = await response.json().catch(() => ({}));
      if (!response.ok)
        return setFeedback({
          kind: "error",
          title: "Upload failed",
          text: result.error ?? "Upload failed.",
        });
      uploadFormRef.current?.reset();
      setFeedback({
        kind: "success",
        title: "Upload complete",
        text: "The image is ready in your media library.",
      });
      router.refresh();
    } catch {
      setFeedback({
        kind: "error",
        title: "Upload failed",
        text: "The upload could not be completed. Check your connection and try again.",
      });
    } finally {
      setUploadPending(false);
    }
  }

  async function remove(id: string) {
    setDeletePending(true);
    setFeedback(null);
    try {
      const response = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        return setFeedback({
          kind: "error",
          title: "Deletion failed",
          text: result.error ?? "Deletion failed.",
        });
      }
      setConfirmDeleteId(null);
      setFeedback({
        kind: "success",
        title: "Media deleted",
        text: "The media asset has been deleted.",
      });
      router.refresh();
    } catch {
      setFeedback({
        kind: "error",
        title: "Deletion failed",
        text: "The media asset could not be deleted. Check your connection and try again.",
      });
    } finally {
      setDeletePending(false);
    }
  }

  return (
    <>
      <div className="admin-panel admin-media-upload">
        <div>
          <p className="admin-eyebrow">Secure upload</p>
          <h2>Add portfolio media</h2>
          <p>JPEG, PNG, WebP, AVIF, or GIF. Maximum 10 MB.</p>
        </div>
        {configured ? (
          <form action={upload} ref={uploadFormRef}>
            <label>
              Image
              <input
                name="file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                required
              />
            </label>
            <label>
              Alt text
              <input name="altText" maxLength={300} placeholder="Describe the image’s meaning" />
            </label>
            <button
              className={`admin-primary-button${uploadPending ? " admin-button-loading" : ""}`}
              disabled={uploadPending}
            >
              <span>
                {uploadPending && <i aria-hidden="true" />}
                <span aria-live="polite">
                  {uploadPending ? "Uploading image…" : "Upload image"}
                </span>
              </span>
            </button>
          </form>
        ) : (
          <p className="admin-form-error">Add the Cloudinary credentials to enable uploads.</p>
        )}
        {feedback && (
          <ActionNotification
            key={`${feedback.kind}-${feedback.title}-${feedback.text}`}
            message={feedback.text}
            title={feedback.title}
            tone={feedback.kind}
          />
        )}
      </div>
      {assets.length === 0 ? (
        <div className="admin-panel admin-empty-state">
          <strong>No media uploaded yet.</strong>
          <p>Your Cloudinary-backed asset library will appear here.</p>
        </div>
      ) : (
        <div className="admin-media-grid">
          {assets.map((asset) => (
            <article className="admin-panel" key={asset.id}>
              <div className="admin-media-preview">
                <Image
                  src={asset.secureUrl}
                  alt={asset.altText ?? ""}
                  fill
                  sizes="(max-width: 720px) 100vw, 25vw"
                />
              </div>
              <strong>{asset.fileName}</strong>
              <p>
                {asset.width} × {asset.height} · {(asset.bytes / 1024).toFixed(0)} KB
              </p>
              <small>{asset.altText || "No alt text"}</small>
              <button
                className="admin-secondary-button"
                onClick={() => setConfirmDeleteId(asset.id)}
                type="button"
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      )}
      {confirmDeleteId && (
        <div
          className="admin-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setConfirmDeleteId(null);
          }}
        >
          <div
            aria-describedby="delete-media-description"
            aria-labelledby="delete-media-title"
            aria-modal="true"
            className="admin-dialog"
            role="dialog"
          >
            <p className="admin-eyebrow">Permanent action</p>
            <h2 id="delete-media-title">Delete this media asset?</h2>
            <p id="delete-media-description">
              Cloudinary and database copies will be removed. Assets currently attached to content
              will remain protected.
            </p>
            <div>
              <button
                className="admin-secondary-button"
                disabled={deletePending}
                onClick={() => setConfirmDeleteId(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="admin-danger-button"
                disabled={deletePending}
                onClick={() => remove(confirmDeleteId)}
                type="button"
              >
                {deletePending ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
