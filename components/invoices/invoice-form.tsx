"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { Plus, Trash2, Save, Send, UserPlus, Package, BookmarkPlus } from "lucide-react"
import { useInvoiceStore } from "@/lib/store/invoice-store"
import { invoiceSchema } from "@/lib/utils/validation"
import { NestButton } from "@/components/nest/nest-button"
import { NestCard, NestCardContent, NestCardHeader, NestCardTitle } from "@/components/nest/nest-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils/calculations"
import { InlineClientForm } from "./inline-client-form"
import { SaveClientDialog } from "./save-client-dialog"
import { SavedItemsDialog } from "./saved-items-dialog"
import { useLineItemsStore } from "@/lib/store/line-items-store"

interface InlineClientData {
  name: string
  email: string
  phone?: string
  address?: string
}

interface InvoiceFormProps {
  onSave: (data: z.infer<typeof invoiceSchema>, status: 'draft' | 'sent', newClient?: InlineClientData) => Promise<void>
  clients?: Array<{ id: string; name: string }>
  initialData?: Partial<z.infer<typeof invoiceSchema>>
  hideTemplateButton?: boolean
}

const PAYMENT_TERMS_PRESETS = [
  'Net 30',
  'Net 15',
  'Net 7',
  'Due on Receipt',
  'Due upon Completion',
  '50% Upfront, 50% on Completion',
  'Custom'
]

export function InvoiceForm({ onSave, clients = [], initialData, hideTemplateButton = false }: InvoiceFormProps) {
  const { items, addItem, updateItem, removeItem, currentInvoice, updateInvoice, recalculateInvoice, setCurrentInvoice } = useInvoiceStore()
  const { addSavedItem } = useLineItemsStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showInlineClient, setShowInlineClient] = useState(false)
  const [inlineClientData, setInlineClientData] = useState<InlineClientData | null>(null)
  const [showSaveClientDialog, setShowSaveClientDialog] = useState(false)
  const [pendingInvoiceData, setPendingInvoiceData] = useState<{data: z.infer<typeof invoiceSchema>, status: 'draft' | 'sent'} | null>(null)
  const [paymentTermsMode, setPaymentTermsMode] = useState<'preset' | 'custom'>('preset')
  const [selectedPaymentTerm, setSelectedPaymentTerm] = useState<string>('')
  const [selectedClient, setSelectedClient] = useState<string>('')
  const [showSavedItemsDialog, setShowSavedItemsDialog] = useState(false)
  const [savedItemIndices, setSavedItemIndices] = useState<Set<number>>(new Set())

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<z.infer<typeof invoiceSchema>>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: initialData || {
      invoice_number: `INV-${format(new Date(), 'yyyyMM')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      issue_date: format(new Date(), 'yyyy-MM-dd'),
      due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      tax_rate: undefined,
      discount: undefined,
      items: [],
    }
  })

  // Load initial data when provided
  useEffect(() => {
    if (initialData) {
      reset(initialData)
      if (initialData.items) {
        setCurrentInvoice({ items: initialData.items })
      }
      if (initialData.client_id) {
        setSelectedClient(initialData.client_id)
      }
      if (initialData.payment_terms) {
        setSelectedPaymentTerm(initialData.payment_terms)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  const taxRate = watch('tax_rate') || 0
  const discount = watch('discount') || 0

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
      await handleSubmit(async (data) => {
        // If using inline client, show save dialog
        if (showInlineClient && inlineClientData) {
          setPendingInvoiceData({ data, status })
          setShowSaveClientDialog(true)
          setIsSubmitting(false)
        } else {
          // Save normally without new client
          await onSave(data, status)
        }
      })()
    } catch (error) {
      setIsSubmitting(false)
      throw error
    }
  }

  const handleSaveClient = async () => {
    if (pendingInvoiceData && inlineClientData) {
      setShowSaveClientDialog(false)
      await onSave(pendingInvoiceData.data, pendingInvoiceData.status, inlineClientData)
      setPendingInvoiceData(null)
      setIsSubmitting(false)
    }
  }

  const handleSkipSaveClient = async () => {
    if (pendingInvoiceData) {
      setShowSaveClientDialog(false)
      await onSave(pendingInvoiceData.data, pendingInvoiceData.status)
      setPendingInvoiceData(null)
      setIsSubmitting(false)
    }
  }

  const handleSelectSavedItem = (savedItem: any) => {
    addItem()
    const newIndex = items.length
    setTimeout(() => {
      updateItem(newIndex, {
        description: savedItem.description,
        quantity: savedItem.default_quantity,
        rate: savedItem.rate
      })
    }, 0)
    setShowSavedItemsDialog(false)
  }

  const handleSaveLineItem = (index: number) => {
    const item = items[index]
    if (!item.description || isNaN(item.rate)) {
      alert('Please fill in description and rate before saving')
      return
    }

    addSavedItem({
      description: item.description,
      rate: item.rate,
      default_quantity: item.quantity,
    })

    // Mark this item as saved
    setSavedItemIndices(prev => new Set(prev).add(index))

    // Show feedback
    setTimeout(() => {
      setSavedItemIndices(prev => {
        const next = new Set(prev)
        next.delete(index)
        return next
      })
    }, 2000)
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

            <div className="col-span-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor="client_id">Client</Label>
                  {!showInlineClient ? (
                    <Select
                      value={selectedClient}
                      onValueChange={(value) => {
                        setSelectedClient(value)
                        setValue('client_id', value)
                      }}
                      disabled={showInlineClient}
                    >
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
                  ) : (
                    <div className="h-10 px-3 py-2 border border-primary bg-primary/10 rounded-md text-sm flex items-center">
                      New Client: {inlineClientData?.name || 'Incomplete'}
                    </div>
                  )}
                </div>
                <NestButton
                  type="button"
                  variant={showInlineClient ? "outline" : "default"}
                  size="sm"
                  onClick={() => {
                    setShowInlineClient(!showInlineClient)
                    if (showInlineClient) {
                      setInlineClientData(null)
                    }
                  }}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {showInlineClient ? 'Select Existing' : 'New Client'}
                </NestButton>
              </div>
            </div>

            {showInlineClient && (
              <div className="col-span-2">
                <InlineClientForm
                  onClientDataChange={setInlineClientData}
                  onCancel={() => {
                    setShowInlineClient(false)
                    setInlineClientData(null)
                  }}
                />
              </div>
            )}

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
          <div className="flex gap-2">
            <NestButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSavedItemsDialog(true)}
            >
              <Package className="w-4 h-4 mr-2" />
              Saved Items
            </NestButton>
            <NestButton
              type="button"
              variant="outline"
              size="sm"
              onClick={addItem}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </NestButton>
          </div>
        </NestCardHeader>
        <NestCardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id || `item-${index}`} className="grid grid-cols-12 gap-4 items-start p-4 border border-border rounded-lg animate-weave">
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
                  value={isNaN(item.rate) ? '' : item.rate}
                  onChange={(e) => updateItem(index, { rate: e.target.value === '' ? NaN : parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>

              <div className="col-span-3 md:col-span-1">
                <Label>Amount</Label>
                <div className="flex items-center h-10 px-3 py-2 text-sm font-semibold text-accent">
                  {formatCurrency(item.amount)}
                </div>
              </div>

              <div className="col-span-1 flex items-end gap-1">
                <NestButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSaveLineItem(index)}
                  title="Save as reusable item"
                >
                  {savedItemIndices.has(index) ? (
                    <BookmarkPlus className="w-4 h-4 text-green-600" />
                  ) : (
                    <BookmarkPlus className="w-4 h-4" />
                  )}
                </NestButton>
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
            {paymentTermsMode === 'preset' ? (
              <Select
                onValueChange={(value) => {
                  if (value === 'Custom') {
                    setPaymentTermsMode('custom')
                    setValue('payment_terms', '')
                  } else {
                    setSelectedPaymentTerm(value)
                    setValue('payment_terms', value)
                  }
                }}
                value={selectedPaymentTerm}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_TERMS_PRESETS.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-2">
                <Input
                  id="payment_terms"
                  {...register('payment_terms')}
                  placeholder="Enter custom payment terms"
                />
                <NestButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPaymentTermsMode('preset')
                    setValue('payment_terms', '')
                    setSelectedPaymentTerm('')
                  }}
                >
                  ← Back to Presets
                </NestButton>
              </div>
            )}
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

      {/* Save Client Dialog */}
      <SaveClientDialog
        open={showSaveClientDialog}
        clientName={inlineClientData?.name || ''}
        onSave={handleSaveClient}
        onSkip={handleSkipSaveClient}
      />

      {/* Saved Items Dialog */}
      <SavedItemsDialog
        open={showSavedItemsDialog}
        onClose={() => setShowSavedItemsDialog(false)}
        onSelectItem={handleSelectSavedItem}
      />
    </form>
  )
}
