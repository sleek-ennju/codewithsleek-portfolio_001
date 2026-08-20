export function DiagonalArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`diagonal-arrow ${className}`.trim()}
      fill="none"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path d="M5 19 19 5M9 5h10v10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
