"use client"

import { NestButton } from "@/components/nest/nest-button";
import { NestCard, NestCardContent } from "@/components/nest/nest-card";
import { EmptyNest } from "@/components/nest/empty-nest";
import { EggStatus } from "@/components/nest/egg-status";
import { FileText, MoreVertical, Edit, Trash2, Copy, Mail, Download, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils/calculations";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
  searchQuery?: string;
}

export function InvoiceList({ invoices, statusFilter, searchQuery }: InvoiceListProps) {
  const router = useRouter();

  // Filter invoices based on status and search
  let filteredInvoices = invoices;

  if (statusFilter) {
    filteredInvoices = filteredInvoices.filter(invoice => invoice.status === statusFilter);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredInvoices = filteredInvoices.filter(invoice =>
      invoice.invoice_number.toLowerCase().includes(query) ||
      invoice.client?.name?.toLowerCase().includes(query) ||
      invoice.client?.email?.toLowerCase().includes(query)
    );
  }

  const handleEdit = (invoice: Invoice) => {
    router.push(`/dashboard/invoices/${invoice.id}/edit`);
  };

  const handleDelete = async (invoice: Invoice) => {
    if (!confirm(`Delete invoice ${invoice.invoice_number}?`)) {
      return;
    }

    const deletePromise = fetch(`/api/invoices/${invoice.id}`, {
      method: 'DELETE',
    }).then(res => {
      if (!res.ok) throw new Error('Failed to delete');
      router.refresh();
    });

    toast.promise(deletePromise, {
      loading: 'Deleting invoice...',
      success: `Invoice ${invoice.invoice_number} deleted`,
      error: 'Failed to delete invoice',
    });
  };

  const handleCopy = (invoice: Invoice) => {
    toast.info(`Copy invoice ${invoice.invoice_number} coming soon!`);
  };

  const handleEmail = async (invoice: Invoice) => {
    if (!invoice.client?.email) {
      toast.error('No client email', {
        description: 'Please add an email address to the client first.'
      });
      return;
    }

    if (!confirm(`Send invoice ${invoice.invoice_number} to ${invoice.client.email}?`)) {
      return;
    }

    const sendPromise = fetch(`/api/invoices/${invoice.id}/send`, {
      method: 'POST',
    }).then(res => {
      if (!res.ok) return res.json().then(data => { throw new Error(data.error) });
      router.refresh();
      return res.json();
    });

    toast.promise(sendPromise, {
      loading: `Sending to ${invoice.client.email}...`,
      success: `Invoice sent successfully!`,
      error: (err) => err.message || 'Failed to send invoice',
    });
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      // Open PDF in new tab
      window.open(`/api/invoices/${invoice.id}/pdf`, '_blank');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  const handleMarkAsPaid = async (invoice: Invoice) => {
    if (invoice.status === 'paid') {
      return; // Already paid
    }

    if (!confirm(`Mark invoice ${invoice.invoice_number} as paid?`)) {
      return;
    }

    const markPaidPromise = fetch(`/api/invoices/${invoice.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'paid' }),
    }).then(res => {
      if (!res.ok) throw new Error('Failed to mark as paid');
      router.refresh();
    });

    toast.promise(markPaidPromise, {
      loading: 'Updating status...',
      success: `Invoice ${invoice.invoice_number} marked as paid!`,
      error: 'Failed to update invoice status',
    });
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
                        <DropdownMenuItem onClick={() => handleDownloadPDF(invoice)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                        {invoice.status !== 'paid' && (
                          <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice)}>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Paid
                          </DropdownMenuItem>
                        )}
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
