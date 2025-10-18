import { NestButton } from "@/components/nest/nest-button";
import { NestCard, NestCardContent, NestCardHeader, NestCardTitle } from "@/components/nest/nest-card";
import { EmptyNest } from "@/components/nest/empty-nest";
import { EggStatus } from "@/components/nest/egg-status";
import Link from "next/link";
import { FileText, AlertCircle, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils/calculations";
import { getInvoices, getDashboardStats } from "@/lib/db/invoices";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Will be redirected by middleware
  }

  // Fetch real data from database
  const invoices = await getInvoices(user.id);
  const stats = await getDashboardStats(user.id);

  // Get recent invoices (last 5, excluding drafts)
  const recentInvoices = invoices
    .filter(inv => inv.status !== 'draft')
    .slice(0, 5);

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
        <Link href="/dashboard/invoices" className="block">
          <NestCard className="animate-nest-settle cursor-pointer transition-all hover:border-primary hover:shadow-md">
            <NestCardHeader>
              <div className="flex items-center justify-between">
                <NestCardTitle className="text-sm font-medium text-muted-foreground">
                  Total Nested
                </NestCardTitle>
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
            </NestCardHeader>
            <NestCardContent>
              <div className="text-3xl font-bold">{stats.totalInvoices}</div>
              <p className="text-sm text-muted-foreground mt-1">Total invoices</p>
            </NestCardContent>
          </NestCard>
        </Link>

        <NestCard className="animate-nest-settle cursor-pointer transition-all hover:border-primary hover:shadow-md" style={{ animationDelay: '0.1s' }}>
          <NestCardHeader>
            <div className="flex items-center justify-between">
              <NestCardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </NestCardTitle>
              <CheckCircle className="w-5 h-5 text-muted-foreground" />
            </div>
          </NestCardHeader>
          <NestCardContent>
            <div className="text-3xl font-bold text-emerald-600">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-sm text-muted-foreground mt-1">{stats.paidInvoices} invoices paid</p>
          </NestCardContent>
        </NestCard>

        <Link href="/dashboard/invoices?status=sent" className="block">
          <NestCard className="animate-nest-settle cursor-pointer transition-all hover:border-primary hover:shadow-md" style={{ animationDelay: '0.2s' }}>
            <NestCardHeader>
              <div className="flex items-center justify-between">
                <NestCardTitle className="text-sm font-medium text-muted-foreground">
                  Awaiting Payment
                </NestCardTitle>
                <CheckCircle className="w-5 h-5 text-muted-foreground" />
              </div>
            </NestCardHeader>
            <NestCardContent>
              <div className="text-3xl font-bold text-primary">{formatCurrency(stats.pendingAmount)}</div>
              <p className="text-sm text-muted-foreground mt-1">{invoices.filter(i => i.status === 'sent').length} invoices pending</p>
            </NestCardContent>
          </NestCard>
        </Link>

        <Link href="/dashboard/invoices?status=overdue" className="block">
          <NestCard className="animate-nest-settle cursor-pointer transition-all hover:border-primary hover:shadow-md" style={{ animationDelay: '0.3s' }}>
            <NestCardHeader>
              <div className="flex items-center justify-between">
                <NestCardTitle className="text-sm font-medium text-muted-foreground">
                  Overdue
                </NestCardTitle>
                <AlertCircle className="w-5 h-5 text-muted-foreground" />
              </div>
            </NestCardHeader>
            <NestCardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.overdueCount}</div>
              <p className="text-sm text-muted-foreground mt-1">invoices overdue</p>
            </NestCardContent>
          </NestCard>
        </Link>
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
                      <div className="text-sm text-muted-foreground">{invoice.client?.name || 'No client'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(invoice.total)}</div>
                      <div className="text-sm text-muted-foreground">Due {format(new Date(invoice.due_date), 'MMM dd, yyyy')}</div>
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
