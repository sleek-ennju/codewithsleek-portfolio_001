import { setContactReadState } from "@/features/contact/actions";
import { getDb } from "@/server/db";

export default async function AdminContactPage() {
  const submissions = await getDb().contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
  const unreadCount = submissions.filter((submission) => !submission.readAt).length;

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Enquiries</p>
          <h1>Contact inbox</h1>
          <p>
            {unreadCount
              ? `${unreadCount} message${unreadCount === 1 ? "" : "s"} waiting for review.`
              : "You’re all caught up."}
          </p>
        </div>
      </div>

      {submissions.length ? (
        <section className="admin-contact-list" aria-label="Contact submissions">
          {submissions.map((submission) => {
            const action = setContactReadState.bind(null, submission.id, !submission.readAt);
            return (
              <article
                className={
                  submission.readAt
                    ? "admin-contact-card"
                    : "admin-contact-card admin-contact-unread"
                }
                key={submission.id}
              >
                <header>
                  <div>
                    <span>{submission.readAt ? "Read" : "New enquiry"}</span>
                    <h2>{submission.name}</h2>
                    <a href={`mailto:${submission.email}`}>{submission.email}</a>
                  </div>
                  <time dateTime={submission.createdAt.toISOString()}>
                    {submission.createdAt.toLocaleString("en-NG", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </header>
                <p>{submission.message}</p>
                <form action={action}>
                  <button className="admin-secondary-button" type="submit">
                    Mark as {submission.readAt ? "unread" : "read"}
                  </button>
                </form>
              </article>
            );
          })}
        </section>
      ) : (
        <div className="admin-panel admin-empty-state">
          <strong>No enquiries yet.</strong>
          <p>Messages submitted through the homepage contact form will appear here.</p>
        </div>
      )}
    </main>
  );
}
