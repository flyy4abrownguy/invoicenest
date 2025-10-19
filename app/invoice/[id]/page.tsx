import { getInvoiceById } from '@/lib/db/invoices'
import { NestCard, NestCardContent, NestCardHeader, NestCardTitle } from '@/components/nest/nest-card'
import { NestButton } from '@/components/nest/nest-button'
import { formatCurrency } from '@/lib/utils/calculations'
import { format } from 'date-fns'
import { EggStatus } from '@/components/nest/egg-status'
import { PaymentButton } from '@/components/payments/payment-button'
import { CreditCard, Download } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let invoice
  try {
    // Try to fetch without user_id for public access
    invoice = await getInvoiceById(id, '')
  } catch (error) {
    notFound()
  }

  if (!invoice) {
    notFound()
  }

  const isPaid = invoice.status === 'paid'

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Invoice {invoice.invoice_number}</h1>
          <div className="flex items-center justify-center gap-2">
            <EggStatus status={invoice.status} />
          </div>
        </div>

        {/* Invoice Details */}
        <NestCard>
          <NestCardHeader>
            <NestCardTitle>Invoice Details</NestCardTitle>
          </NestCardHeader>
          <NestCardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Issue Date</p>
                <p className="font-medium">{format(new Date(invoice.issue_date), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">{format(new Date(invoice.due_date), 'MMM dd, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount Due</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(invoice.total)}</p>
              </div>
            </div>

            {/* Items */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Items</h3>
              <div className="space-y-2">
                {invoice.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.rate)}
                      </p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.amount)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.tax_rate > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax ({invoice.tax_rate}%)</span>
                  <span>{formatCurrency(invoice.tax_amount)}</span>
                </div>
              )}
              {invoice.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span>-{formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(invoice.total)}</span>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>
            )}

            {/* Payment Terms */}
            {invoice.payment_terms && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Payment Terms</h3>
                <p className="text-sm text-muted-foreground">{invoice.payment_terms}</p>
              </div>
            )}
          </NestCardContent>
        </NestCard>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <NestButton variant="outline" size="lg">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </NestButton>

          {!isPaid && (
            <PaymentButton invoiceId={id}>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </PaymentButton>
          )}
        </div>

        {isPaid && (
          <div className="text-center p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-800 font-semibold">✓ This invoice has been paid</p>
            <p className="text-sm text-emerald-600 mt-1">Thank you for your payment!</p>
          </div>
        )}
      </div>
    </div>
  )
}
