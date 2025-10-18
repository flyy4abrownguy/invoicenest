"use client"

import { useState } from "react"
import { NestButton } from "@/components/nest/nest-button"
import { NestCard, NestCardContent } from "@/components/nest/nest-card"
import { EmptyNest } from "@/components/nest/empty-nest"
import { ClientDialog } from "@/components/clients/client-dialog"
import { Mail, Phone, MapPin, Edit, Trash2 } from "lucide-react"
import { Client } from "@/lib/types"
import { useRouter } from "next/navigation"

interface ClientsGridProps {
  initialClients: Client[]
}

export function ClientsGrid({ initialClients }: ClientsGridProps) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | undefined>()

  const handleAddClient = () => {
    setEditingClient(undefined)
    setIsDialogOpen(true)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setIsDialogOpen(true)
  }

  const handleSaveClient = async (data: Partial<Client>) => {
    try {
      if (editingClient) {
        // Update existing client
        const response = await fetch(`/api/clients/${editingClient.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error('Failed to update client')
        }
      } else {
        // Add new client
        const response = await fetch('/api/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error('Failed to create client')
        }
      }

      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error saving client:', error)
      alert('Failed to save client. Please try again.')
    }
  }

  const handleDeleteClient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) {
      return
    }

    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete client')
      }

      router.refresh()
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Failed to delete client. Please try again.')
    }
  }

  return (
    <>
      {initialClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialClients.map((client, index) => (
            <NestCard
              key={client.id}
              hover
              className="animate-nest-settle"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <NestCardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{client.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <NestButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClient(client)}
                    >
                      <Edit className="w-4 h-4" />
                    </NestButton>
                    <NestButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </NestButton>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  {client.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{client.address}</span>
                    </div>
                  )}
                </div>

                {client.notes && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {client.notes}
                    </p>
                  </div>
                )}
              </NestCardContent>
            </NestCard>
          ))}
        </div>
      ) : (
        <NestCard>
          <NestCardContent className="p-12">
            <EmptyNest
              message="No clients yet"
              subMessage="Add your first client to get started"
            />
          </NestCardContent>
        </NestCard>
      )}

      <ClientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        client={editingClient}
        onSave={handleSaveClient}
      />

      {/* Floating Add Button */}
      <div className="fixed bottom-8 right-8">
        <NestButton size="lg" withNest onClick={handleAddClient}>
          Add Client
        </NestButton>
      </div>
    </>
  )
}
