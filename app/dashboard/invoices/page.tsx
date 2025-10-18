"use client"

import { NestButton } from "@/components/nest/nest-button";
import { NestCard, NestCardContent } from "@/components/nest/nest-card";
import { EmptyNest } from "@/components/nest/empty-nest";
import { EggStatus } from "@/components/nest/egg-status";
import Link from "next/link";
import { FileText, Search, MoreVertical, Edit, Trash2, Copy, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils/calculations";
import { useDraftStore } from "@/lib/store/draft-store";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample invoice data (sent/paid invoices)
const sentInvoices = [
  {
    id: "1",
    invoice_number: "INV-202501-0001",
    client_name: "Acme Corp",
    total: 5000,
    status: "paid" as const,
    issue_date: "2025-01-01",
    due_date: "2025-01-15",
  },
  {
    id: "2",
    invoice_number: "INV-202501-0002",
    client_name: "TechStart Inc",
    total: 3200,
    status: "sent" as const,
    issue_date: "2025-01-05",
    due_date: "2025-01-20",
  },
  {
    id: "3",
    invoice_number: "INV-202501-0003",
    client_name: "Design Studio",
    total: 1800,
    status: "overdue" as const,
    issue_date: "2024-12-20",
    due_date: "2025-01-10",
  },
];

export default function InvoicesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { drafts, removeDraft } = useDraftStore()
  const [statusFilter, setStatusFilter] = useState<string>("")

  // Set initial filter from URL query parameter
  useEffect(() => {
    const status = searchParams.get('status')
    if (status) {
      setStatusFilter(status)
    }
  }, [searchParams])

  // Combine drafts and sent invoices
  const allInvoices = [
    ...drafts.map(draft => ({
      id: draft.id,
      invoice_number: draft.invoice_number,
      client_name: draft.client?.name || "No client selected",
      total: draft.total,
      status: "draft" as const,
      issue_date: format(new Date(draft.issue_date), 'yyyy-MM-dd'),
      due_date: format(new Date(draft.due_date), 'yyyy-MM-dd'),
      isDraft: true,
    })),
    ...sentInvoices.map(inv => ({ ...inv, isDraft: false }))
  ]

  // Filter invoices based on status
  const filteredInvoices = statusFilter
    ? allInvoices.filter(invoice => invoice.status === statusFilter)
    : allInvoices

  const handleEdit = (invoice: typeof allInvoices[0]) => {
    if (invoice.isDraft) {
      // For drafts, navigate to edit page with draft ID
      router.push(`/dashboard/invoices/new?draftId=${invoice.id}`)
    } else {
      // For sent invoices, navigate to edit page
      router.push(`/dashboard/invoices/${invoice.id}/edit`)
    }
  }

  const handleDelete = (invoice: typeof allInvoices[0]) => {
    if (invoice.isDraft) {
      if (confirm(`Delete draft ${invoice.invoice_number}?`)) {
        removeDraft(invoice.id)
      }
    } else {
      alert('Delete sent invoice functionality coming soon!')
    }
  }

  const handleCopy = (invoice: typeof allInvoices[0]) => {
    alert(`Copy invoice ${invoice.invoice_number} functionality coming soon!`)
  }

  const handleEmail = (invoice: typeof allInvoices[0]) => {
    alert(`Email invoice ${invoice.invoice_number} functionality coming soon!`)
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Invoices</h2>
          <p className="text-muted-foreground mt-1">Manage all your nested invoices</p>
        </div>
        <Link href="/dashboard/invoices/new">
          <NestButton size="lg" withNest>
            Create Invoice
          </NestButton>
        </Link>
      </div>

      {/* Search and Filters */}
      <NestCard>
        <NestCardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                className="pl-10"
              />
            </div>
            <select
              className="px-4 py-2 border border-border rounded-lg bg-background"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </NestCardContent>
      </NestCard>

      {/* Invoice List */}
      {filteredInvoices.length > 0 ? (
        <div className="space-y-4">
          {filteredInvoices.map((invoice, index) => (
            <NestCard
              key={invoice.id}
              hover
              className="animate-nest-settle"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <NestCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                    onClick={() => handleEdit(invoice)}
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{invoice.invoice_number}</div>
                      <div className="text-muted-foreground">{invoice.client_name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Issued</div>
                      <div className="font-medium">{invoice.issue_date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Due</div>
                      <div className="font-medium">{invoice.due_date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Amount</div>
                      <div className="font-bold text-lg">{formatCurrency(invoice.total)}</div>
                    </div>
                    <EggStatus status={invoice.status} />

                    {/* Actions Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <NestButton variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="w-4 h-4" />
                        </NestButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(invoice)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopy(invoice)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEmail(invoice)}>
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(invoice)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </NestCardContent>
            </NestCard>
          ))}
        </div>
      ) : (
        <NestCard>
          <NestCardContent className="p-12">
            <EmptyNest />
          </NestCardContent>
        </NestCard>
      )}
    </div>
  );
}
