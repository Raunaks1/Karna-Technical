export default function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left/Top/Bottom Gray Arc */}
      <path
        d="M 90 25 A 45 45 0 1 0 90 95"
        stroke="#6B7280"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Right Yellow/Gold Arc */}
      <path
        d="M 97 38 A 45 45 0 0 1 97 82"
        stroke="#E8A317"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* The "k" shape (Dark Red) */}
      {/* Vertical stem */}
      <rect x="42" y="28" width="10" height="64" fill="#8B3A3A" />

      {/* Upper diagonal */}
      <path d="M 52 60 L 80 35 L 90 35 L 52 68 Z" fill="#8B3A3A" />

      {/* Lower diagonal */}
      <path d="M 52 55 L 90 85 L 80 85 L 52 63 Z" fill="#8B3A3A" />

      {/* TM Sign */}
      <text
        x="100"
        y="60"
        fontFamily="sans-serif"
        fontWeight="bold"
        fontSize="12"
        fill="#1E232E"
      >
        TM
      </text>
    </svg>
  );
}
