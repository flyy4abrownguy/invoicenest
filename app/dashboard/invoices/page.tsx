import { NestButton } from "@/components/nest/nest-button";
import { NestCard, NestCardContent } from "@/components/nest/nest-card";
import { EmptyNest } from "@/components/nest/empty-nest";
import { EggStatus } from "@/components/nest/egg-status";
import Link from "next/link";
import { FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils/calculations";

// Sample invoice data
const invoices = [
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
  {
    id: "4",
    invoice_number: "INV-202501-0004",
    client_name: "Marketing Pro",
    total: 2500,
    status: "draft" as const,
    issue_date: "2025-01-10",
    due_date: "2025-01-25",
  },
];

export default function InvoicesPage() {
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
            <select className="px-4 py-2 border border-border rounded-lg bg-background">
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
      {invoices.length > 0 ? (
        <div className="space-y-4">
          {invoices.map((invoice, index) => (
            <NestCard
              key={invoice.id}
              hover
              className="cursor-pointer animate-nest-settle"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <NestCardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
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
