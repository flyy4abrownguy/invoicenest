"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { Plus, Trash2, Save, Send } from "lucide-react"
import { useInvoiceStore } from "@/lib/store/invoice-store"
import { invoiceSchema } from "@/lib/utils/validation"
import { NestButton } from "@/components/nest/nest-button"
import { NestCard, NestCardContent, NestCardHeader, NestCardTitle } from "@/components/nest/nest-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils/calculations"

interface InvoiceFormProps {
  onSave: (data: z.infer<typeof invoiceSchema>, status: 'draft' | 'sent') => Promise<void>
  clients?: Array<{ id: string; name: string }>
}

export function InvoiceForm({ onSave, clients = [] }: InvoiceFormProps) {
  const { items, addItem, updateItem, removeItem, currentInvoice, updateInvoice, recalculateInvoice } = useInvoiceStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoice_number: `INV-${format(new Date(), 'yyyyMM')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      issue_date: format(new Date(), 'yyyy-MM-dd'),
      due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      tax_rate: 0,
      discount: 0,
      items: [],
    }
  })

  const taxRate = watch('tax_rate')
  const discount = watch('discount')

  useEffect(() => {
    if (items.length === 0) {
      addItem()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    updateInvoice({ tax_rate: Number(taxRate), discount: Number(discount) })
    recalculateInvoice()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxRate, discount])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue('items', items as any)
    recalculateInvoice()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, setValue])

  const handleSaveInvoice = async (status: 'draft' | 'sent') => {
    setIsSubmitting(true)
    try {
      await handleSubmit((data) => onSave(data, status))()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-6">
      {/* Invoice Details Section */}
      <NestCard className="animate-nest-settle">
        <NestCardHeader>
          <NestCardTitle>Invoice Details</NestCardTitle>
        </NestCardHeader>
        <NestCardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice_number">Invoice Number</Label>
              <Input
                id="invoice_number"
                {...register('invoice_number')}
                placeholder="INV-202501-0001"
              />
              {errors.invoice_number && (
                <p className="text-sm text-destructive mt-1">{errors.invoice_number.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="client_id">Client</Label>
              <Select onValueChange={(value) => setValue('client_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input
                id="issue_date"
                type="date"
                {...register('issue_date')}
              />
              {errors.issue_date && (
                <p className="text-sm text-destructive mt-1">{errors.issue_date.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                {...register('due_date')}
              />
              {errors.due_date && (
                <p className="text-sm text-destructive mt-1">{errors.due_date.message}</p>
              )}
            </div>
          </div>
        </NestCardContent>
      </NestCard>

      {/* Line Items Section */}
      <NestCard className="animate-nest-settle" style={{ animationDelay: '0.1s' }}>
        <NestCardHeader className="flex items-center justify-between">
          <NestCardTitle>Line Items</NestCardTitle>
          <NestButton
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </NestButton>
        </NestCardHeader>
        <NestCardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-start p-4 border border-border rounded-lg animate-weave">
              <div className="col-span-12 md:col-span-5">
                <Label htmlFor={`item-description-${index}`}>Description</Label>
                <Input
                  id={`item-description-${index}`}
                  value={item.description}
                  onChange={(e) => updateItem(index, { description: e.target.value })}
                  placeholder="Service or product description"
                />
              </div>

              <div className="col-span-4 md:col-span-2">
                <Label htmlFor={`item-quantity-${index}`}>Quantity</Label>
                <Input
                  id={`item-quantity-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, { quantity: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="col-span-4 md:col-span-2">
                <Label htmlFor={`item-rate-${index}`}>Rate</Label>
                <Input
                  id={`item-rate-${index}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) => updateItem(index, { rate: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="col-span-3 md:col-span-2">
                <Label>Amount</Label>
                <div className="flex items-center h-10 px-3 py-2 text-sm font-semibold text-accent">
                  {formatCurrency(item.amount)}
                </div>
              </div>

              <div className="col-span-1 flex items-end">
                <NestButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </NestButton>
              </div>
            </div>
          ))}
        </NestCardContent>
      </NestCard>

      {/* Calculations Section */}
      <NestCard className="animate-nest-settle" style={{ animationDelay: '0.2s' }}>
        <NestCardHeader>
          <NestCardTitle>Calculations</NestCardTitle>
        </NestCardHeader>
        <NestCardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tax_rate">Tax Rate (%)</Label>
              <Input
                id="tax_rate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                {...register('tax_rate', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="discount">Discount ($)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                step="0.01"
                {...register('discount', { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">{formatCurrency(currentInvoice?.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax ({taxRate || 0}%):</span>
              <span className="font-medium">{formatCurrency(currentInvoice?.tax_amount || 0)}</span>
            </div>
            {Number(discount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount:</span>
                <span className="font-medium text-destructive">-{formatCurrency(Number(discount) || 0)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span>Total:</span>
              <span className="text-primary">{formatCurrency(currentInvoice?.total || 0)}</span>
            </div>
          </div>
        </NestCardContent>
      </NestCard>

      {/* Additional Details Section */}
      <NestCard className="animate-nest-settle" style={{ animationDelay: '0.3s' }}>
        <NestCardHeader>
          <NestCardTitle>Additional Details</NestCardTitle>
        </NestCardHeader>
        <NestCardContent className="space-y-4">
          <div>
            <Label htmlFor="payment_terms">Payment Terms</Label>
            <Input
              id="payment_terms"
              {...register('payment_terms')}
              placeholder="e.g., Net 30, Due on receipt"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes or special instructions for the client"
              rows={4}
            />
          </div>
        </NestCardContent>
      </NestCard>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <NestButton
          type="button"
          variant="outline"
          size="lg"
          onClick={() => handleSaveInvoice('draft')}
          disabled={isSubmitting}
        >
          <Save className="w-4 h-4 mr-2" />
          Save as Draft
        </NestButton>
        <NestButton
          type="button"
          size="lg"
          onClick={() => handleSaveInvoice('sent')}
          disabled={isSubmitting}
          withNest
        >
          <Send className="w-4 h-4 mr-2" />
          Save & Send
        </NestButton>
      </div>
    </form>
  )
}
