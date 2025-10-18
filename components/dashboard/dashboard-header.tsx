"use client"

import { useEffect, useState } from "react"
import { getTierLimits } from "@/lib/config/feature-flags"
import { createClient } from "@/lib/supabase/client"

export function DashboardHeader() {
  const [userEmail, setUserEmail] = useState<string>("")
  const [tier, setTier] = useState<string>("Free Tier")

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
        const limits = getTierLimits(user.email)
        const tierName = limits.tier.charAt(0).toUpperCase() + limits.tier.slice(1)
        setTier(`${tierName} Tier`)
      }
    }
    loadUser()
  }, [])

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur">
      <div className="px-8 h-16 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          {userEmail && (
            <div className="text-sm text-muted-foreground">
              {userEmail}
            </div>
          )}
          <div className="text-sm">
            <span className="text-muted-foreground">Plan:</span>{" "}
            <span className="font-medium text-primary">{tier}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
