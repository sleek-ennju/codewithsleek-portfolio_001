export function ResumeDownload({ href, floating = false }: { href: string; floating?: boolean }) {
  return (
    <a
      className={floating ? "resume-download-float" : "button button-light liquid-button"}
      href={href}
      download="Emmanuel-Ihenacho-Resume.pdf"
      aria-label="Download Emmanuel Ihenacho's résumé as a PDF"
    >
      <svg className="resume-download-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" />
      </svg>
      <span>{floating ? "Résumé PDF" : "Download résumé"}</span>
    </a>
  );
}
