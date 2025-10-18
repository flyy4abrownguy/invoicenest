import Image from "next/image";

export function NestLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <Image
      src="/logo-inspired.svg"
      alt="InvoiceNest Logo"
      width={32}
      height={32}
      className={className}
    />
  );
}

export function NestLogoWithText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <NestLogo className="w-8 h-8" />
      <span className="font-bold text-xl text-foreground">InvoiceNest</span>
    </div>
  );
}
