import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NestCard, NestCardContent } from "@/components/nest/nest-card"
import { getClients } from "@/lib/db/clients"
import { createClient } from "@/lib/supabase/server"
import { ClientsGrid } from "@/components/clients/clients-grid"

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null // Will be redirected by middleware
  }

  const clients = await getClients(user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Clients</h2>
          <p className="text-muted-foreground mt-1">Manage your client information</p>
        </div>
      </div>

      {/* Search */}
      <NestCard>
        <NestCardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-10"
            />
          </div>
        </NestCardContent>
      </NestCard>

      {/* Clients Grid */}
      <ClientsGrid initialClients={clients} />
    </div>
  )
}
