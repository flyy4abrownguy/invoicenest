"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import { DraftSelectorDialog } from "@/components/invoices/draft-selector-dialog"
import { InvoiceTemplatesDialog } from "@/components/invoices/invoice-templates-dialog"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { NestButton } from "@/components/nest/nest-button"
import { useDraftStore } from "@/lib/store/draft-store"
import { Invoice } from "@/lib/types"
import { InvoiceTemplate } from "@/lib/data/invoice-templates"
import { useInvoiceStore } from "@/lib/store/invoice-store"
import { format } from "date-fns"

// Mock clients data - will be replaced with actual data fetching
const mockClients = [
  { id: "1", name: "Acme Corp" },
  { id: "2", name: "TechStart Inc" },
  { id: "3", name: "Design Studio" },
]

interface NewClientData {
  name: string
  email: string
  phone?: string
  address?: string
}

export default function NewInvoicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { drafts, addDraft, removeDraft, getDraft } = useDraftStore()
  const { setCurrentInvoice } = useInvoiceStore()
  const [showDraftDialog, setShowDraftDialog] = useState(false)
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false)
  const [selectedDraft, setSelectedDraft] = useState<Invoice | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate | null>(null)
  const [hasCheckedDrafts, setHasCheckedDrafts] = useState(false)

  // Load draft from query parameter if provided
  useEffect(() => {
    const draftId = searchParams.get('draftId')
    if (draftId && !selectedDraft) {
      const draft = getDraft(draftId)
      if (draft) {
        setSelectedDraft(draft)
        setHasCheckedDrafts(true) // Prevent dialog from showing
      }
    }
  }, [searchParams, selectedDraft, getDraft])

  useEffect(() => {
    // Show draft dialog on mount if there are drafts and not already editing one
    // Don't show if we have a draftId in the URL (user is clicking on existing draft)
    const draftId = searchParams.get('draftId')
    if (!hasCheckedDrafts && drafts.length > 0 && !selectedDraft && !draftId) {
      setShowDraftDialog(true)
      setHasCheckedDrafts(true)
    }
  }, [drafts.length, hasCheckedDrafts, selectedDraft, searchParams])

  const handleSaveInvoice = async (data: unknown, status: 'draft' | 'sent', newClient?: NewClientData) => {
    console.log('=== handleSaveInvoice called ===')
    console.log('Data:', data)
    console.log('Status:', status)
    console.log('New Client:', newClient)

    try {
      const invoiceData = data as Partial<Invoice>

      // Prepare client data
      let clientData = selectedDraft?.client
      if (newClient) {
        // New client entered inline
        clientData = {
          id: `temp-client-${Date.now()}`,
          user_id: 'user-1',
          name: newClient.name,
          email: newClient.email,
          phone: newClient.phone,
          address: newClient.address,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      } else if (invoiceData.client_id) {
        // Existing client selected - find from mockClients
        const selectedClient = mockClients.find(c => c.id === invoiceData.client_id)
        if (selectedClient) {
          clientData = {
            id: selectedClient.id,
            user_id: 'user-1',
            name: selectedClient.name,
            email: undefined,
            phone: undefined,
            address: undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        }
      }

      // Create invoice object
      const invoice: Invoice = {
        id: selectedDraft?.id || `invoice-${Date.now()}`,
        user_id: 'user-1', // TODO: Get from auth
        client_id: invoiceData.client_id || clientData?.id || undefined,
        client: clientData,
        invoice_number: invoiceData.invoice_number || '',
        issue_date: invoiceData.issue_date || new Date().toISOString(),
        due_date: invoiceData.due_date || new Date().toISOString(),
        subtotal: invoiceData.subtotal || 0,
        tax_rate: invoiceData.tax_rate || 0,
        tax_amount: invoiceData.tax_amount || 0,
        discount: invoiceData.discount || 0,
        total: invoiceData.total || 0,
        status,
        payment_terms: invoiceData.payment_terms,
        notes: invoiceData.notes,
        items: invoiceData.items || [],
        is_recurring: false,
        created_at: selectedDraft?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      if (status === 'draft') {
        // Save to drafts
        console.log('Saving as draft...')
        if (selectedDraft) {
          // Update existing draft
          removeDraft(selectedDraft.id)
        }
        addDraft(invoice)
        console.log('Draft saved successfully!')

        // Redirect to invoices list
        router.push('/dashboard/invoices')
      } else {
        // Save as sent invoice
        console.log('Saving as sent invoice...')

        // If new client provided, save it
        if (newClient) {
          console.log('Saving new client:', newClient)
          // TODO: Implement actual API call to save client
        }

        // Remove from drafts if it was a draft
        if (selectedDraft) {
          removeDraft(selectedDraft.id)
        }

        // TODO: Implement actual API call to save invoice to database
        await new Promise(resolve => setTimeout(resolve, 1500))

        console.log('Invoice sent successfully! Redirecting...')
        router.push('/dashboard/invoices')
      }
    } catch (error) {
      console.error('Error saving invoice:', error)
      alert('Error saving invoice: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleSelectDraft = (draft: Invoice) => {
    setSelectedDraft(draft)
    setShowDraftDialog(false)
  }

  const handleStartNew = () => {
    setSelectedDraft(null)
    setSelectedTemplate(null)
    setShowDraftDialog(false)
  }

  const handleUseTemplate = () => {
    setShowDraftDialog(false)
    setShowTemplatesDialog(true)
  }

  const handleSelectTemplate = (template: InvoiceTemplate) => {
    setSelectedTemplate(template)
    setShowTemplatesDialog(false)
  }

  const handleDeleteDraft = (id: string) => {
    removeDraft(id)
  }

  // Prepare initial data from template or draft - memoized to prevent re-renders
  const initialFormData = useMemo(() => {
    if (selectedTemplate) {
      return {
        invoice_number: `INV-${format(new Date(), 'yyyyMM')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        issue_date: format(new Date(), 'yyyy-MM-dd'),
        due_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        payment_terms: selectedTemplate.payment_terms,
        notes: selectedTemplate.notes,
        items: selectedTemplate.items.map((item, index) => ({
          id: `temp-${Date.now()}-${index}`,
          invoice_id: '',
          description: item.description,
          quantity: item.default_quantity,
          rate: item.rate,
          amount: item.rate * item.default_quantity,
          sort_order: index,
          created_at: new Date().toISOString()
        }))
      }
    }
    return selectedDraft || undefined
  }, [selectedTemplate, selectedDraft])

  return (
    <>
      {/* Draft Selector Dialog */}
      <DraftSelectorDialog
        open={showDraftDialog}
        drafts={drafts}
        onSelectDraft={handleSelectDraft}
        onStartNew={handleStartNew}
        onUseTemplate={handleUseTemplate}
        onDeleteDraft={handleDeleteDraft}
        onClose={() => setShowDraftDialog(false)}
      />

      {/* Invoice Templates Dialog */}
      <InvoiceTemplatesDialog
        open={showTemplatesDialog}
        onClose={() => setShowTemplatesDialog(false)}
        onSelectTemplate={handleSelectTemplate}
      />

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

          {drafts.length > 0 && (
            <NestButton
              variant="outline"
              size="sm"
              onClick={() => setShowDraftDialog(true)}
            >
              View Drafts ({drafts.length})
            </NestButton>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">
            {selectedDraft ? 'Edit Draft Invoice' : 'Create New Invoice'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {selectedDraft
              ? `Editing draft: ${selectedDraft.invoice_number}`
              : 'Fill in the details below to create your invoice'}
          </p>
        </div>

        {/* Invoice Form */}
        <InvoiceForm
          onSave={handleSaveInvoice}
          clients={mockClients}
          initialData={initialFormData}
          hideTemplateButton={true}
        />
      </div>
    </>
  )
}
