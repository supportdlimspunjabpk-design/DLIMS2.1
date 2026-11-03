export function DlimsEmblem({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <circle cx="40" cy="40" r="39" fill="#1c8a3a" />
      <circle cx="40" cy="40" r="35.5" fill="none" stroke="#e3c56a" strokeWidth="1.2" />
      <path
        d="M24 22c6 1 8 6 8 6s-4 2-8 1c2 4 2 9 0 13 5-1 9 1 9 1s-2 6-8 7c3-6 3-12 0-18 4 0 7-3 7-3s-3-4-8-7z"
        fill="#d7b45a"
      />
      <path
        d="M56 22c-6 1-8 6-8 6s4 2 8 1c-2 4-2 9 0 13-5-1-9 1-9 1s2 6 8 7c-3-6-3-12 0-18-4 0-7-3-7-3s3-4 8-7z"
        fill="#d7b45a"
      />
      <path
        d="M40 16c2 4 2 7 0 10-2-3-2-6 0-10zM36.5 27h7l1.2 4h-9.4zM37.2 32h5.6l.6 16h-6.8zM35 49h10l2 4H33zM34 54.5h12v2.2H34z"
        fill="#f3e2a4"
      />
      <path d="M40 14.5a7 7 0 0 0 6.2 8.4 6.2 6.2 0 1 1-6.2-8.4z" fill="#f7f1dc" />
      <path d="M46.2 16.2l.7 1.6 1.7.2-1.3 1.1.4 1.7-1.5-.9-1.5.9.4-1.7-1.3-1.1 1.7-.2z" fill="#f6d56a" />
    </svg>
  );
}
