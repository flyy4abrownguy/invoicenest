"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { InvoiceStatus } from "@/lib/types";

interface StatusFilterProps {
  currentStatus?: string;
}

export function StatusFilter({ currentStatus }: StatusFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (newStatus) {
      params.set('status', newStatus);
    } else {
      params.delete('status');
    }

    router.push(`/dashboard/invoices?${params.toString()}`);
  };

  return (
    <select
      className="px-4 py-2 border border-border rounded-lg bg-background"
      value={currentStatus || ""}
      onChange={handleStatusChange}
    >
      <option value="">All Status</option>
      <option value="draft">Draft</option>
      <option value="sent">Sent</option>
      <option value="paid">Paid</option>
      <option value="overdue">Overdue</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
