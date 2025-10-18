"use client"

import { NestButton } from "@/components/nest/nest-button";
import { NestCard, NestCardContent } from "@/components/nest/nest-card";
import { EmptyNest } from "@/components/nest/empty-nest";
import { EggStatus } from "@/components/nest/egg-status";
import { FileText, MoreVertical, Edit, Trash2, Copy, Mail } from "lucide-react";
import { formatCurrency } from "@/lib/utils/calculations";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Invoice } from "@/lib/types";

interface InvoiceListProps {
  invoices: Invoice[];
  statusFilter?: string;
}

export function InvoiceList({ invoices, statusFilter }: InvoiceListProps) {
  const router = useRouter();

  // Filter invoices based on status
  const filteredInvoices = statusFilter
    ? invoices.filter(invoice => invoice.status === statusFilter)
    : invoices;

  const handleEdit = (invoice: Invoice) => {
    router.push(`/dashboard/invoices/${invoice.id}/edit`);
  };

  const handleDelete = async (invoice: Invoice) => {
    if (!confirm(`Delete invoice ${invoice.invoice_number}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/invoices/${invoice.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete invoice');
      }

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice. Please try again.');
    }
  };

  const handleCopy = (invoice: Invoice) => {
    alert(`Copy invoice ${invoice.invoice_number} functionality coming soon!`);
  };

  const handleEmail = (invoice: Invoice) => {
    alert(`Email invoice ${invoice.invoice_number} functionality coming soon!`);
  };

  return (
    <>
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
                      <div className="text-muted-foreground">{invoice.client?.name || 'No client'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Issued</div>
                      <div className="font-medium">{format(new Date(invoice.issue_date), 'MMM dd, yyyy')}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Due</div>
                      <div className="font-medium">{format(new Date(invoice.due_date), 'MMM dd, yyyy')}</div>
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
    </>
  );
}
