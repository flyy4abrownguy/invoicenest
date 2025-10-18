"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Mail, Download, Trash2 } from "lucide-react"
import Link from "next/link"
import { NestButton } from "@/components/nest/nest-button"
import { NestCard, NestCardContent, NestCardHeader, NestCardTitle } from "@/components/nest/nest-card"
import { EggStatus } from "@/components/nest/egg-status"
import { formatCurrency } from "@/lib/utils/calculations"
import { format } from "date-fns"

// Mock invoice data - will be replaced with actual data fetching
const mockInvoices = [
  {
    id: "1",
    invoice_number: "INV-202501-0001",
    client_name: "Acme Corp",
    client_email: "contact@acmecorp.com",
    client_address: "123 Business St, Suite 100, New York, NY 10001",
    total: 5000,
    subtotal: 5000,
    tax_rate: 0,
    tax_amount: 0,
    discount: 0,
    status: "paid" as const,
    issue_date: "2025-01-01",
    due_date: "2025-01-15",
    payment_terms: "Net 15",
    notes: "Thank you for your business!",
    items: [
      {
        id: "1",
        description: "Website Development",
        quantity: 1,
        rate: 5000,
        amount: 5000,
      },
    ],
  },
  {
    id: "2",
    invoice_number: "INV-202501-0002",
    client_name: "TechStart Inc",
    client_email: "billing@techstart.com",
    client_address: "456 Tech Ave, San Francisco, CA 94102",
    total: 3200,
    subtotal: 3000,
    tax_rate: 6.67,
    tax_amount: 200,
    discount: 0,
    status: "sent" as const,
    issue_date: "2025-01-05",
    due_date: "2025-01-20",
    payment_terms: "Net 15",
    notes: "Payment due within 15 days",
    items: [
      {
        id: "1",
        description: "Mobile App Design",
        quantity: 40,
        rate: 75,
        amount: 3000,
      },
    ],
  },
  {
    id: "3",
    invoice_number: "INV-202501-0003",
    client_name: "Design Studio",
    client_email: "accounts@designstudio.com",
    client_address: "789 Creative Blvd, Los Angeles, CA 90001",
    total: 1800,
    subtotal: 1800,
    tax_rate: 0,
    tax_amount: 0,
    discount: 0,
    status: "overdue" as const,
    issue_date: "2024-12-20",
    due_date: "2025-01-10",
    payment_terms: "Net 30",
    notes: "Please remit payment at your earliest convenience",
    items: [
      {
        id: "1",
        description: "Logo Design",
        quantity: 1,
        rate: 1200,
        amount: 1200,
      },
      {
        id: "2",
        description: "Brand Guidelines Document",
        quantity: 1,
        rate: 600,
        amount: 600,
      },
    ],
  },
]

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string

  // Find the invoice
  const invoice = mockInvoices.find((inv) => inv.id === invoiceId)

  if (!invoice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices">
            <NestButton variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Invoices
            </NestButton>
          </Link>
        </div>
        <NestCard>
          <NestCardContent className="p-12 text-center">
            <p className="text-muted-foreground">Invoice not found</p>
          </NestCardContent>
        </NestCard>
      </div>
    )
  }

  const handleEdit = () => {
    router.push(`/dashboard/invoices/${invoice.id}/edit`)
  }

  const handleEmail = () => {
    alert(`Email invoice ${invoice.invoice_number} functionality coming soon!`)
  }

  const handleDownload = () => {
    alert(`Download invoice ${invoice.invoice_number} as PDF functionality coming soon!`)
  }

  const handleDelete = () => {
    if (confirm(`Delete invoice ${invoice.invoice_number}?`)) {
      alert('Delete functionality coming soon!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices">
            <NestButton variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Invoices
            </NestButton>
          </Link>
        </div>

        <div className="flex gap-2">
          <NestButton variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </NestButton>
          <NestButton variant="outline" size="sm" onClick={handleEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Email
          </NestButton>
          <NestButton variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </NestButton>
          <NestButton variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2 text-destructive" />
            Delete
          </NestButton>
        </div>
      </div>

      {/* Invoice Header */}
      <NestCard className="animate-nest-settle">
        <NestCardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{invoice.invoice_number}</h1>
              <p className="text-muted-foreground mt-1">
                Invoice for {invoice.client_name}
              </p>
            </div>
            <EggStatus status={invoice.status} />
          </div>
        </NestCardContent>
      </NestCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Information */}
        <NestCard className="animate-nest-settle" style={{ animationDelay: '0.1s' }}>
          <NestCardHeader>
            <NestCardTitle>Bill To</NestCardTitle>
          </NestCardHeader>
          <NestCardContent className="space-y-2">
            <p className="font-semibold">{invoice.client_name}</p>
            <p className="text-sm text-muted-foreground">{invoice.client_email}</p>
            <p className="text-sm text-muted-foreground">{invoice.client_address}</p>
          </NestCardContent>
        </NestCard>

        {/* Invoice Details */}
        <NestCard className="animate-nest-settle" style={{ animationDelay: '0.15s' }}>
          <NestCardHeader>
            <NestCardTitle>Invoice Details</NestCardTitle>
          </NestCardHeader>
          <NestCardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Issue Date:</span>
              <span className="text-sm font-medium">
                {format(new Date(invoice.issue_date), 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Due Date:</span>
              <span className="text-sm font-medium">
                {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
              </span>
            </div>
            {invoice.payment_terms && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Payment Terms:</span>
                <span className="text-sm font-medium">{invoice.payment_terms}</span>
              </div>
            )}
          </NestCardContent>
        </NestCard>
      </div>

      {/* Line Items */}
      <NestCard className="animate-nest-settle" style={{ animationDelay: '0.2s' }}>
        <NestCardHeader>
          <NestCardTitle>Line Items</NestCardTitle>
        </NestCardHeader>
        <NestCardContent>
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 pb-2 border-b border-border text-sm font-semibold text-muted-foreground">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-right">Quantity</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            {/* Items */}
            {invoice.items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 text-sm">
                <div className="col-span-6">{item.description}</div>
                <div className="col-span-2 text-right">{item.quantity}</div>
                <div className="col-span-2 text-right">{formatCurrency(item.rate)}</div>
                <div className="col-span-2 text-right font-semibold">
                  {formatCurrency(item.amount)}
                </div>
              </div>
            ))}
          </div>
        </NestCardContent>
      </NestCard>

      {/* Totals */}
      <NestCard className="animate-nest-settle" style={{ animationDelay: '0.25s' }}>
        <NestCardContent className="p-6">
          <div className="space-y-2 max-w-sm ml-auto">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.tax_rate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({invoice.tax_rate}%):</span>
                <span className="font-medium">{formatCurrency(invoice.tax_amount)}</span>
              </div>
            )}
            {invoice.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount:</span>
                <span className="font-medium text-destructive">
                  -{formatCurrency(invoice.discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span>Total:</span>
              <span className="text-primary">{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </NestCardContent>
      </NestCard>

      {/* Notes */}
      {invoice.notes && (
        <NestCard className="animate-nest-settle" style={{ animationDelay: '0.3s' }}>
          <NestCardHeader>
            <NestCardTitle>Notes</NestCardTitle>
          </NestCardHeader>
          <NestCardContent>
            <p className="text-sm text-muted-foreground">{invoice.notes}</p>
          </NestCardContent>
        </NestCard>
      )}
    </div>
  )
}
