export function EmptyNest({
  message = "Your nest is empty",
  subMessage = "Create your first invoice to get started",
  className = ""
}: {
  message?: string;
  subMessage?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <svg
        viewBox="0 0 200 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-48 h-36 text-muted-foreground opacity-50 mb-4"
      >
        {/* Empty nest */}
        <path
          d="M40 100 Q30 80, 40 60 Q50 40, 70 30 Q90 25, 110 25 Q130 25, 150 30 Q170 40, 160 60 Q170 80, 160 100"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeDasharray="5,5"
        />
        {/* Scattered twigs */}
        <line x1="40" y1="60" x2="25" y2="50" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        <line x1="50" y1="70" x2="32" y2="65" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        <line x1="160" y1="60" x2="175" y2="50" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        <line x1="150" y1="70" x2="168" y2="65" stroke="currentColor" strokeWidth="2" opacity="0.4" />
        <line x1="100" y1="35" x2="100" y2="20" stroke="currentColor" strokeWidth="2" opacity="0.4" />

        {/* Question mark in center */}
        <text x="100" y="75" fontSize="32" fill="currentColor" opacity="0.3" textAnchor="middle">?</text>
      </svg>
      <h3 className="text-lg font-semibold text-foreground mb-1">{message}</h3>
      <p className="text-sm text-muted-foreground">{subMessage}</p>
    </div>
  );
}
