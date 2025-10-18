"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import { NestCard, NestCardContent, NestCardHeader, NestCardTitle } from "@/components/nest/nest-card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { NestButton } from "@/components/nest/nest-button"

// Mock clients data - will be replaced with actual data fetching
const mockClients = [
  { id: "1", name: "Acme Corp" },
  { id: "2", name: "TechStart Inc" },
  { id: "3", name: "Design Studio" },
]

export default function NewInvoicePage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveInvoice = async (data: any, status: 'draft' | 'sent') => {
    setIsSaving(true)
    try {
      // TODO: Implement actual API call to save invoice
      console.log('Saving invoice:', { ...data, status })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Redirect to invoices list
      router.push('/dashboard/invoices')
    } catch (error) {
      console.error('Error saving invoice:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/invoices">
          <NestButton variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Invoices
          </NestButton>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Create New Invoice</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details below to create your invoice
        </p>
      </div>

      {/* Invoice Form */}
      <InvoiceForm onSave={handleSaveInvoice} clients={mockClients} />
    </div>
  )
}
