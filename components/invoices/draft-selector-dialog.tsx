"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { NestButton } from "@/components/nest/nest-button"
import { NestCard } from "@/components/nest/nest-card"
import { FileText, Plus, Trash2, Sparkles } from "lucide-react"
import { Invoice } from "@/lib/types"
import { formatCurrency } from "@/lib/utils/calculations"

interface DraftSelectorDialogProps {
  open: boolean
  drafts: Invoice[]
  onSelectDraft: (draft: Invoice) => void
  onStartNew: () => void
  onUseTemplate: () => void
  onDeleteDraft: (id: string) => void
  onClose: () => void
}

export function DraftSelectorDialog({
  open,
  drafts,
  onSelectDraft,
  onStartNew,
  onUseTemplate,
  onDeleteDraft,
  onClose
}: DraftSelectorDialogProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setDeletingId(id)
    onDeleteDraft(id)
    setTimeout(() => setDeletingId(null), 300)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Continue from Draft or Start New?</DialogTitle>
          <DialogDescription>
            You have {drafts.length} draft invoice{drafts.length !== 1 ? 's' : ''}. Select one to continue editing, or start a new invoice.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <NestButton
              onClick={onStartNew}
              className="w-full"
              size="lg"
              withNest
            >
              <Plus className="w-4 h-4 mr-2" />
              Start New Invoice
            </NestButton>
            <NestButton
              onClick={onUseTemplate}
              className="w-full"
              size="lg"
              variant="outline"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Use Template
            </NestButton>
          </div>

          {/* Drafts List */}
          {drafts.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Or continue from a draft:</p>
              {drafts.map((draft) => (
                <NestCard
                  key={draft.id}
                  className={`cursor-pointer hover:border-primary transition-all ${
                    deletingId === draft.id ? 'opacity-50' : ''
                  }`}
                  onClick={() => onSelectDraft(draft)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <FileText className="w-5 h-5 text-muted-foreground mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{draft.invoice_number}</h4>
                            <span className="text-xs px-2 py-0.5 bg-muted rounded">Draft</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {draft.client?.name || 'No client selected'}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>Due: {format(new Date(draft.due_date), 'MMM dd, yyyy')}</span>
                            <span className="font-semibold text-primary">
                              {formatCurrency(draft.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <NestButton
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDelete(e, draft.id)}
                        disabled={deletingId === draft.id}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </NestButton>
                    </div>
                  </div>
                </NestCard>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
