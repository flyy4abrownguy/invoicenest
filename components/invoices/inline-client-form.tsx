"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NestButton } from "@/components/nest/nest-button"
import { X } from "lucide-react"
import { formatPhoneNumber } from "@/lib/utils/phone-formatter"

interface InlineClientData {
  name: string
  email: string
  phone?: string
  address?: string
}

interface InlineClientFormProps {
  onClientDataChange: (data: InlineClientData | null) => void
  onCancel: () => void
}

export function InlineClientForm({ onClientDataChange, onCancel }: InlineClientFormProps) {
  const [clientData, setClientData] = useState<InlineClientData>({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  const handleChange = (field: keyof InlineClientData, value: string) => {
    // Auto-format phone number
    const finalValue = field === 'phone' ? formatPhoneNumber(value) : value
    const updated = { ...clientData, [field]: finalValue }
    setClientData(updated)

    // Only pass data if name and email are filled (minimum required)
    if (updated.name && updated.email) {
      onClientDataChange(updated)
    } else {
      onClientDataChange(null)
    }
  }

  return (
    <div className="space-y-4 p-4 border border-primary/30 rounded-lg bg-primary/5">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-primary">New Client Details</Label>
        <NestButton
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
        >
          <X className="w-4 h-4" />
        </NestButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="new-client-name">Client Name *</Label>
          <Input
            id="new-client-name"
            value={clientData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Acme Corp"
          />
        </div>

        <div>
          <Label htmlFor="new-client-email">Email *</Label>
          <Input
            id="new-client-email"
            type="email"
            value={clientData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="billing@acme.com"
          />
        </div>

        <div>
          <Label htmlFor="new-client-phone">Phone</Label>
          <Input
            id="new-client-phone"
            value={clientData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <Label htmlFor="new-client-address">Address</Label>
          <Textarea
            id="new-client-address"
            value={clientData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="123 Main St, City, State"
            rows={2}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        * Required fields. You'll be prompted to save this client when you submit the invoice.
      </p>
    </div>
  )
}
