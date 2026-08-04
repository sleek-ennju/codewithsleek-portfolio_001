export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">CODEwithSleek</p>
          <p className="footer-note">Crafting logic, the sleek way.</p>
        </div>
        <div>
          <p className="footer-label">Start a conversation</p>
          <p className="footer-pending">Verified contact details will publish with the content platform.</p>
        </div>
        <div>
          <p className="footer-label">Elsewhere</p>
          <p className="footer-pending">GitHub · LinkedIn · X</p>
        </div>
        <p className="footer-copyright">© {new Date().getFullYear()} Code with Sleek</p>
      </div>
    </footer>
  );
}
