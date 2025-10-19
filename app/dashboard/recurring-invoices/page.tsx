import { NestButton } from "@/components/nest/nest-button";
import Link from "next/link";
import { getRecurringInvoices } from "@/lib/db/recurring-invoices";
import { createClient } from "@/lib/supabase/server";
import { RecurringInvoiceList } from "@/components/recurring-invoices/recurring-invoice-list";

export const dynamic = 'force-dynamic';

export default async function RecurringInvoicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Will be redirected by middleware
  }

  const recurringInvoices = await getRecurringInvoices(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Recurring Invoices</h2>
          <p className="text-muted-foreground mt-1">Automate your regular billing cycles</p>
        </div>
        <Link href="/dashboard/recurring-invoices/new">
          <NestButton size="lg" withNest>
            Create Recurring Invoice
          </NestButton>
        </Link>
      </div>

      {/* Recurring Invoice List */}
      <RecurringInvoiceList recurringInvoices={recurringInvoices} />
    </div>
  );
}
