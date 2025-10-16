export function NestLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Nest structure */}
      <path
        d="M20 70 Q15 60, 20 50 Q25 40, 35 35 Q45 30, 55 30 Q65 30, 75 35 Q85 40, 80 50 Q85 60, 80 70 Q75 75, 65 75 Q55 75, 45 75 Q35 75, 25 70 Z"
        fill="currentColor"
        opacity="0.2"
      />
      <path
        d="M20 70 Q15 60, 20 50 Q25 40, 35 35 Q45 30, 55 30 Q65 30, 75 35 Q85 40, 80 50 Q85 60, 80 70"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      {/* Twigs */}
      <line x1="20" y1="50" x2="15" y2="45" stroke="currentColor" strokeWidth="1.5" />
      <line x1="25" y1="55" x2="18" y2="52" stroke="currentColor" strokeWidth="1.5" />
      <line x1="80" y1="50" x2="85" y2="45" stroke="currentColor" strokeWidth="1.5" />
      <line x1="75" y1="55" x2="82" y2="52" stroke="currentColor" strokeWidth="1.5" />

      {/* Invoice/eggs inside */}
      <ellipse cx="40" cy="55" rx="8" ry="10" fill="currentColor" opacity="0.6" />
      <ellipse cx="55" cy="57" rx="7" ry="9" fill="currentColor" opacity="0.7" />
      <ellipse cx="65" cy="55" rx="8" ry="10" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function NestLogoWithText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <NestLogo className="w-8 h-8 text-primary" />
      <span className="font-bold text-xl text-foreground">InvoiceNest</span>
    </div>
  );
}
