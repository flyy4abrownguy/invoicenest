"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { NestButton } from "@/components/nest/nest-button"
import { UserPlus, X } from "lucide-react"

interface SaveClientDialogProps {
  open: boolean
  clientName: string
  onSave: () => void
  onSkip: () => void
}

export function SaveClientDialog({ open, clientName, onSave, onSkip }: SaveClientDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onSkip()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save New Client?</DialogTitle>
          <DialogDescription>
            Would you like to save "{clientName}" to your clients list for future invoices?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Saving this client will make it easier to create invoices for them in the future.
            You can always add them to your clients list later from the Clients page.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <NestButton
            type="button"
            variant="outline"
            onClick={onSkip}
          >
            <X className="w-4 h-4 mr-2" />
            Skip
          </NestButton>
          <NestButton
            type="button"
            onClick={onSave}
            withNest
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Save Client
          </NestButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
