"use client"

import { useState } from "react"
import { NestButton } from "@/components/nest/nest-button"
import { NestCard, NestCardContent } from "@/components/nest/nest-card"
import { EmptyNest } from "@/components/nest/empty-nest"
import { ClientDialog } from "@/components/clients/client-dialog"
import { Users, Mail, Phone, MapPin, Plus, Edit, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Client } from "@/lib/types"

// Mock clients data
const mockClients: Client[] = [
  {
    id: "1",
    user_id: "user-1",
    name: "Acme Corp",
    email: "contact@acmecorp.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, Suite 100, New York, NY 10001",
    notes: "Main client - monthly retainer",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    user_id: "user-1",
    name: "TechStart Inc",
    email: "billing@techstart.io",
    phone: "+1 (555) 987-6543",
    address: "456 Innovation Drive, San Francisco, CA 94103",
    created_at: "2025-01-05T00:00:00Z",
    updated_at: "2025-01-05T00:00:00Z",
  },
  {
    id: "3",
    user_id: "user-1",
    name: "Design Studio",
    email: "hello@designstudio.co",
    phone: "+1 (555) 246-8135",
    address: "789 Creative Lane, Austin, TX 78701",
    notes: "Project-based work",
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-01-10T00:00:00Z",
  },
]

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | undefined>()
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddClient = () => {
    setEditingClient(undefined)
    setIsDialogOpen(true)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setIsDialogOpen(true)
  }

  const handleSaveClient = async (data: any) => {
    // TODO: Implement actual API call
    console.log('Saving client:', data)

    if (editingClient) {
      // Update existing client
      setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...data } : c))
    } else {
      // Add new client
      const newClient: Client = {
        id: `client-${Date.now()}`,
        user_id: "user-1",
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setClients([...clients, newClient])
    }
  }

  const handleDeleteClient = async (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      // TODO: Implement actual API call
      setClients(clients.filter(c => c.id !== id))
    }
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Clients</h2>
          <p className="text-muted-foreground mt-1">Manage your client relationships</p>
        </div>
        <NestButton size="lg" onClick={handleAddClient} withNest>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </NestButton>
      </div>

      {/* Search */}
      <NestCard>
        <NestCardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </NestCardContent>
      </NestCard>

      {/* Client List */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <NestCard
              key={client.id}
              hover
              className="animate-nest-settle"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <NestCardContent className="p-6 space-y-4">
                {/* Client Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Client Details */}
                <div className="space-y-2">
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{client.address}</span>
                    </div>
                  )}
                </div>

                {client.notes && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground line-clamp-2">{client.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <NestButton
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditClient(client)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </NestButton>
                  <NestButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </NestButton>
                </div>
              </NestCardContent>
            </NestCard>
          ))}
        </div>
      ) : (
        <NestCard>
          <NestCardContent className="p-12">
            {searchQuery ? (
              <div className="text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No clients found</p>
                <p className="text-muted-foreground">Try a different search term</p>
              </div>
            ) : (
              <EmptyNest
                message="No clients yet"
                subMessage="Add your first client to get started"
              />
            )}
          </NestCardContent>
        </NestCard>
      )}

      {/* Client Dialog */}
      <ClientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveClient}
        client={editingClient}
      />
    </div>
  )
}
