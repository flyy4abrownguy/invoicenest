import { NestButton } from "@/components/nest/nest-button";
import { NestCard, NestCardContent, NestCardHeader, NestCardTitle } from "@/components/nest/nest-card";
import { EmptyNest } from "@/components/nest/empty-nest";
import { EggStatus } from "@/components/nest/egg-status";
import Link from "next/link";
import { DollarSign, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils/calculations";

// Sample data for demonstration
const stats = {
  totalNested: 12,
  totalRevenue: 24580.50,
  awaiting: 8,
  awaitingAmount: 12400.00,
  overdue: 2,
  overdueAmount: 3200.00,
};

const recentInvoices = [
  {
    id: "1",
    invoice_number: "INV-202501-0001",
    client_name: "Acme Corp",
    total: 5000,
    status: "paid" as const,
    due_date: "2025-01-15",
  },
  {
    id: "2",
    invoice_number: "INV-202501-0002",
    client_name: "TechStart Inc",
    total: 3200,
    status: "sent" as const,
    due_date: "2025-01-20",
  },
  {
    id: "3",
    invoice_number: "INV-202501-0003",
    client_name: "Design Studio",
    total: 1800,
    status: "overdue" as const,
    due_date: "2025-01-10",
  },
];

export default function DashboardPage() {
  const hasInvoices = recentInvoices.length > 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Welcome to Your Nest</h2>
          <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your invoices</p>
        </div>
        <Link href="/dashboard/invoices/new">
          <NestButton size="lg" withNest>
            Create New Invoice
          </NestButton>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NestCard className="animate-nest-settle">
          <NestCardHeader>
            <div className="flex items-center justify-between">
              <NestCardTitle className="text-sm font-medium text-muted-foreground">
                Total Nested
              </NestCardTitle>
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
          </NestCardHeader>
          <NestCardContent>
            <div className="text-3xl font-bold">{stats.totalNested}</div>
            <p className="text-sm text-muted-foreground mt-1">Total invoices</p>
          </NestCardContent>
        </NestCard>

        <NestCard className="animate-nest-settle" style={{ animationDelay: '0.1s' }}>
          <NestCardHeader>
            <div className="flex items-center justify-between">
              <NestCardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </NestCardTitle>
              <DollarSign className="w-5 h-5 text-muted-foreground" />
            </div>
          </NestCardHeader>
          <NestCardContent>
            <div className="text-3xl font-bold text-accent">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-sm text-muted-foreground mt-1">All time revenue</p>
          </NestCardContent>
        </NestCard>

        <NestCard className="animate-nest-settle" style={{ animationDelay: '0.2s' }}>
          <NestCardHeader>
            <div className="flex items-center justify-between">
              <NestCardTitle className="text-sm font-medium text-muted-foreground">
                Awaiting Payment
              </NestCardTitle>
              <CheckCircle className="w-5 h-5 text-muted-foreground" />
            </div>
          </NestCardHeader>
          <NestCardContent>
            <div className="text-3xl font-bold text-primary">{formatCurrency(stats.awaitingAmount)}</div>
            <p className="text-sm text-muted-foreground mt-1">{stats.awaiting} invoices pending</p>
          </NestCardContent>
        </NestCard>

        <NestCard className="animate-nest-settle" style={{ animationDelay: '0.3s' }}>
          <NestCardHeader>
            <div className="flex items-center justify-between">
              <NestCardTitle className="text-sm font-medium text-muted-foreground">
                Overdue
              </NestCardTitle>
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
            </div>
          </NestCardHeader>
          <NestCardContent>
            <div className="text-3xl font-bold text-orange-600">{formatCurrency(stats.overdueAmount)}</div>
            <p className="text-sm text-muted-foreground mt-1">{stats.overdue} invoices overdue</p>
          </NestCardContent>
        </NestCard>
      </div>

      {/* Recent Invoices */}
      <NestCard>
        <NestCardHeader className="flex items-center justify-between">
          <NestCardTitle>Recent Invoices</NestCardTitle>
          <Link href="/dashboard/invoices">
            <NestButton variant="outline" size="sm">
              View All
            </NestButton>
          </Link>
        </NestCardHeader>
        <NestCardContent>
          {hasInvoices ? (
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{invoice.invoice_number}</div>
                      <div className="text-sm text-muted-foreground">{invoice.client_name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(invoice.total)}</div>
                      <div className="text-sm text-muted-foreground">Due {invoice.due_date}</div>
                    </div>
                    <EggStatus status={invoice.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyNest
              message="Your nest is empty"
              subMessage="Create your first invoice to get started"
            />
          )}
        </NestCardContent>
      </NestCard>
    </div>
  );
}
