import { cn } from "@/lib/utils/cn";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

const statusConfig: Record<InvoiceStatus, { label: string; color: string; icon: string }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-700 border-gray-300", icon: "○" },
  sent: { label: "Sent", color: "bg-blue-100 text-blue-700 border-blue-300", icon: "◐" },
  paid: { label: "Paid", color: "bg-amber-100 text-amber-700 border-amber-300", icon: "●" },
  overdue: { label: "Overdue", color: "bg-orange-100 text-orange-700 border-orange-300", icon: "◓" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700 border-red-300", icon: "✕" }
};

export function EggStatus({
  status,
  showLabel = true,
  size = "default"
}: {
  status: InvoiceStatus;
  showLabel?: boolean;
  size?: "sm" | "default" | "lg";
}) {
  const config = statusConfig[status];
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    default: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5"
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 rounded-full border font-medium",
      config.color,
      sizeClasses[size]
    )}>
      <span className="text-lg leading-none">{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}
