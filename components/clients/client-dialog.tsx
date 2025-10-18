"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { clientSchema } from "@/lib/utils/validation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NestButton } from "@/components/nest/nest-button"
import { Client } from "@/lib/types"

interface ClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: z.infer<typeof clientSchema>) => Promise<void>
  client?: Client
}

export function ClientDialog({ open, onOpenChange, onSave, client }: ClientDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: client ? {
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      notes: client.notes || '',
    } : {
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    }
  })

  const handleSaveClient = async (data: z.infer<typeof clientSchema>) => {
    try {
      await onSave(data)
      reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving client:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{client ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {client ? 'Update client information below.' : 'Add a new client to your nest.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSaveClient)} className="space-y-4">
          <div>
            <Label htmlFor="name">Client Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Acme Corp"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="contact@acmecorp.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="123 Main St, City, State, ZIP"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes about this client"
              rows={3}
            />
          </div>

          <DialogFooter>
            <NestButton
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </NestButton>
            <NestButton type="submit" disabled={isSubmitting} withNest>
              {isSubmitting ? 'Saving...' : client ? 'Update Client' : 'Add Client'}
            </NestButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
