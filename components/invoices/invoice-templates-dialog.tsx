"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { NestButton } from "@/components/nest/nest-button"
import { NestCard } from "@/components/nest/nest-card"
import { INVOICE_TEMPLATES, InvoiceTemplate } from "@/lib/data/invoice-templates"
import { formatCurrency } from "@/lib/utils/calculations"
import { FileText, Briefcase } from "lucide-react"

interface InvoiceTemplatesDialogProps {
  open: boolean
  onClose: () => void
  onSelectTemplate: (template: InvoiceTemplate) => void
}

export function InvoiceTemplatesDialog({ open, onClose, onSelectTemplate }: InvoiceTemplatesDialogProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')

  // Get unique industries
  const industries = ['all', ...Array.from(new Set(INVOICE_TEMPLATES.map(t => t.industry)))]

  // Filter templates by industry
  const filteredTemplates = selectedIndustry === 'all'
    ? INVOICE_TEMPLATES
    : INVOICE_TEMPLATES.filter(t => t.industry === selectedIndustry)

  const handleSelectTemplate = (template: InvoiceTemplate) => {
    onSelectTemplate(template)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Templates</DialogTitle>
          <DialogDescription>
            Choose from pre-built invoice templates for different industries. These templates include common line items and settings to get you started quickly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Industry Filter */}
          <div className="flex gap-2 flex-wrap">
            {industries.map((industry) => (
              <NestButton
                key={industry}
                type="button"
                variant={selectedIndustry === industry ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedIndustry(industry)}
              >
                {industry === 'all' ? 'All Industries' : industry}
              </NestButton>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => {
              const total = template.items.reduce((sum, item) => sum + (item.rate * item.default_quantity), 0)

              return (
                <NestCard
                  key={template.id}
                  className="p-4 cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-xs text-muted-foreground">{template.industry}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Estimated</div>
                        <div className="font-bold text-primary">{formatCurrency(total)}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground">{template.description}</p>

                    {/* Items Preview */}
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-muted-foreground">
                        Includes {template.items.length} items:
                      </div>
                      <div className="space-y-1">
                        {template.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-muted-foreground truncate flex-1 mr-2">
                              {item.description}
                            </span>
                            <span className="text-muted-foreground font-medium">
                              {formatCurrency(item.rate * item.default_quantity)}
                            </span>
                          </div>
                        ))}
                        {template.items.length > 3 && (
                          <div className="text-xs text-muted-foreground italic">
                            +{template.items.length - 3} more items...
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2 border-t border-border">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          <FileText className="w-3 h-3 inline mr-1" />
                          {template.payment_terms}
                        </span>
                        <NestButton
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSelectTemplate(template)}
                        >
                          Use Template →
                        </NestButton>
                      </div>
                    </div>
                  </div>
                </NestCard>
              )
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No templates found for this industry.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
