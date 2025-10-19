"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

export function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }

    router.push(`/dashboard/invoices?${params.toString()}`)
  }, 300)

  const handleSearch = (value: string) => {
    setQuery(value)
    debouncedSearch(value)
  }

  return (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search invoices, clients..."
        className="pl-10"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}
