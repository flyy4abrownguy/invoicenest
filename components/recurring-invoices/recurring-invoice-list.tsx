"use client"

import { NestButton } from "@/components/nest/nest-button";
import { NestCard, NestCardContent } from "@/components/nest/nest-card";
import { EmptyNest } from "@/components/nest/empty-nest";
import { Repeat, MoreVertical, Edit, Trash2, Play, Pause } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RecurringInvoice } from "@/lib/types";

interface RecurringInvoiceListProps {
  recurringInvoices: RecurringInvoice[];
}

export function RecurringInvoiceList({ recurringInvoices }: RecurringInvoiceListProps) {
  const router = useRouter();

  const handleEdit = (invoice: RecurringInvoice) => {
    router.push(`/dashboard/recurring-invoices/${invoice.id}/edit`);
  };

  const handleDelete = async (invoice: RecurringInvoice) => {
    if (!confirm(`Delete recurring invoice template for ${invoice.client?.name}?`)) {
      return;
    }

    const deletePromise = fetch(`/api/recurring-invoices/${invoice.id}`, {
      method: 'DELETE',
    }).then(res => {
      if (!res.ok) throw new Error('Failed to delete');
      router.refresh();
    });

    toast.promise(deletePromise, {
      loading: 'Deleting recurring invoice...',
      success: 'Recurring invoice deleted',
      error: 'Failed to delete recurring invoice',
    });
  };

  const handleToggleActive = async (invoice: RecurringInvoice) => {
    const newStatus = !invoice.is_active;
    const action = newStatus ? 'activated' : 'paused';

    const togglePromise = fetch(`/api/recurring-invoices/${invoice.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_active: newStatus }),
    }).then(res => {
      if (!res.ok) throw new Error('Failed to toggle status');
      router.refresh();
    });

    toast.promise(togglePromise, {
      loading: `${newStatus ? 'Activating' : 'Pausing'}...`,
      success: `Recurring invoice ${action}`,
      error: 'Failed to update status',
    });
  };

  const handleGenerateNow = async (invoice: RecurringInvoice) => {
    if (!confirm(`Generate invoice now for ${invoice.client?.name}?`)) {
      return;
    }

    const generatePromise = fetch(`/api/recurring-invoices/${invoice.id}/generate`, {
      method: 'POST',
    }).then(res => {
      if (!res.ok) throw new Error('Failed to generate');
      router.refresh();
      router.push('/dashboard/invoices');
    });

    toast.promise(generatePromise, {
      loading: 'Generating invoice...',
      success: 'Invoice generated successfully!',
      error: 'Failed to generate invoice',
    });
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly',
    };
    return labels[frequency] || frequency;
  };

  const calculateSubtotal = (invoice: RecurringInvoice) => {
    if (!invoice.items) return 0;
    return invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  return (
    <>
      {recurringInvoices.length > 0 ? (
        <div className="space-y-4">
          {recurringInvoices.map((invoice, index) => {
            const subtotal = calculateSubtotal(invoice);
            const taxAmount = subtotal * (invoice.tax_rate / 100);
            const total = subtotal + taxAmount;

            return (
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
                      <div className={`w-12 h-12 rounded-full ${invoice.is_active ? 'bg-primary/10' : 'bg-muted'} flex items-center justify-center`}>
                        <Repeat className={`w-6 h-6 ${invoice.is_active ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <div className="font-semibold text-lg flex items-center gap-2">
                          {invoice.client?.name || 'No client'}
                          {!invoice.is_active && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                              Paused
                            </span>
                          )}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {getFrequencyLabel(invoice.frequency)} • {invoice.invoice_number_prefix}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Next Invoice</div>
                        <div className="font-medium">
                          {invoice.is_active
                            ? format(new Date(invoice.next_generation_date), 'MMM dd, yyyy')
                            : '-'
                          }
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Amount</div>
                        <div className="font-bold text-lg">
                          ${total.toFixed(2)}
                        </div>
                      </div>

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
                          <DropdownMenuItem onClick={() => handleGenerateNow(invoice)}>
                            <Play className="w-4 h-4 mr-2" />
                            Generate Now
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleActive(invoice)}>
                            {invoice.is_active ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
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
            );
          })}
        </div>
      ) : (
        <NestCard>
          <NestCardContent className="p-12">
            <EmptyNest />
          </NestCardContent>
        </NestCard>
      )}
    </>
  );
}
