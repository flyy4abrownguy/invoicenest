import { NestButton } from "@/components/nest/nest-button";
import { NestCard, NestCardContent } from "@/components/nest/nest-card";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getInvoices } from "@/lib/db/invoices";
import { createClient } from "@/lib/supabase/server";
import { InvoiceList } from "@/components/invoices/invoice-list";
import { StatusFilter } from "@/components/invoices/status-filter";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Will be redirected by middleware
  }

  const invoices = await getInvoices(user.id);
  const { status } = await searchParams;

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
            <StatusFilter currentStatus={status} />
          </div>
        </NestCardContent>
      </NestCard>

      {/* Invoice List */}
      <InvoiceList invoices={invoices} statusFilter={status} />
    </div>
  );
}
