"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Asset = { id: string; secureUrl: string; altText: string | null; fileName: string; width: number | null; height: number | null; bytes: number };

export function MediaManager({ assets, configured }: { assets: Asset[]; configured: boolean }) {
  const router = useRouter();
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [pending, setPending] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function upload(formData: FormData) {
    setPending(true); setFeedback(null);
    const response = await fetch("/api/admin/media", { method: "POST", body: formData });
    const result = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) return setFeedback({ kind: "error", text: result.error ?? "Upload failed." });
    setFeedback({ kind: "success", text: "Image uploaded successfully." }); router.refresh();
  }

  async function remove(id: string) {
    setPending(true); setFeedback(null);
    const response = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    setPending(false); setConfirmDeleteId(null);
    if (!response.ok) { const result = await response.json().catch(() => ({})); return setFeedback({ kind: "error", text: result.error ?? "Deletion failed." }); }
    setFeedback({ kind: "success", text: "Media asset deleted." }); router.refresh();
  }

  return <>
    <div className="admin-panel admin-media-upload">
      <div><p className="admin-eyebrow">Secure upload</p><h2>Add portfolio media</h2><p>JPEG, PNG, WebP, AVIF, or GIF. Maximum 10 MB.</p></div>
      {configured ? <form action={upload}><label>Image<input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" required /></label><label>Alt text<input name="altText" maxLength={300} placeholder="Describe the image’s meaning" /></label><button className="admin-primary-button" disabled={pending}>{pending ? "Uploading…" : "Upload image"}</button></form> : <p className="admin-form-error">Add the Cloudinary credentials to enable uploads.</p>}
      {feedback && <div className={`admin-feedback admin-feedback-${feedback.kind}`} role={feedback.kind === "error" ? "alert" : "status"}>{feedback.text}<button aria-label="Dismiss message" onClick={() => setFeedback(null)} type="button">×</button></div>}
    </div>
    {assets.length === 0 ? <div className="admin-panel admin-empty-state"><strong>No media uploaded yet.</strong><p>Your Cloudinary-backed asset library will appear here.</p></div> : <div className="admin-media-grid">{assets.map((asset) => <article className="admin-panel" key={asset.id}><div className="admin-media-preview"><Image src={asset.secureUrl} alt={asset.altText ?? ""} fill sizes="(max-width: 720px) 100vw, 25vw" /></div><strong>{asset.fileName}</strong><p>{asset.width} × {asset.height} · {(asset.bytes / 1024).toFixed(0)} KB</p><small>{asset.altText || "No alt text"}</small><button className="admin-secondary-button" onClick={() => setConfirmDeleteId(asset.id)} type="button">Delete</button></article>)}</div>}
    {confirmDeleteId && <div className="admin-dialog-backdrop" onMouseDown={(event) => { if (event.currentTarget === event.target) setConfirmDeleteId(null); }}><div aria-describedby="delete-media-description" aria-labelledby="delete-media-title" aria-modal="true" className="admin-dialog" role="dialog"><p className="admin-eyebrow">Permanent action</p><h2 id="delete-media-title">Delete this media asset?</h2><p id="delete-media-description">Cloudinary and database copies will be removed. Assets currently attached to content will remain protected.</p><div><button className="admin-secondary-button" disabled={pending} onClick={() => setConfirmDeleteId(null)} type="button">Cancel</button><button className="admin-danger-button" disabled={pending} onClick={() => remove(confirmDeleteId)} type="button">{pending ? "Deleting…" : "Delete permanently"}</button></div></div></div>}
  </>;
}
