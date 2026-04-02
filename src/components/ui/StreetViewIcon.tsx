export function StreetViewIcon({ className, size = 24 }: { className?: string, size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="5" r="2.5" fill="currentColor" stroke="none" />
      <path d="M15 9H9c-1.1 0-2 .9-2 2v3h2v6h6v-6h2v-3c0-1.1-.9-2-2-2z" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="21" rx="7" ry="2" strokeWidth="2.5" />
    </svg>
  );
}
