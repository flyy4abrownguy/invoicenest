"use client"

import { useState, useMemo } from "react"
import { NestCard, NestCardContent, NestCardHeader, NestCardTitle } from "@/components/nest/nest-card"
import { DollarSign, ChevronDown, Calendar } from "lucide-react"
import { formatCurrency } from "@/lib/utils/calculations"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { NestButton } from "@/components/nest/nest-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { startOfDay, startOfWeek, startOfMonth, endOfDay, isWithinInterval, parseISO } from "date-fns"

type RevenuePeriod = 'today' | 'week' | 'month' | 'all' | 'custom'

interface Invoice {
  id: string
  total: number
  status: string
  due_date: string
}

interface RevenueCardProps {
  invoices: Invoice[]
}

export function RevenueCard({ invoices }: RevenueCardProps) {
  const [period, setPeriod] = useState<RevenuePeriod>('all')
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' })
  const [showCustomRange, setShowCustomRange] = useState(false)

  // Calculate real revenue based on paid invoices and date filters
  const getRevenueForPeriod = useMemo(() => {
    // Only count paid invoices
    const paidInvoices = invoices.filter(inv => inv.status === 'paid')

    if (paidInvoices.length === 0) return 0

    const now = new Date()

    let filteredInvoices = paidInvoices

    switch (period) {
      case 'today':
        const todayStart = startOfDay(now)
        const todayEnd = endOfDay(now)
        filteredInvoices = paidInvoices.filter(inv => {
          const dueDate = parseISO(inv.due_date)
          return isWithinInterval(dueDate, { start: todayStart, end: todayEnd })
        })
        break

      case 'week':
        const weekStart = startOfWeek(now)
        const weekEnd = endOfDay(now)
        filteredInvoices = paidInvoices.filter(inv => {
          const dueDate = parseISO(inv.due_date)
          return isWithinInterval(dueDate, { start: weekStart, end: weekEnd })
        })
        break

      case 'month':
        const monthStart = startOfMonth(now)
        const monthEnd = endOfDay(now)
        filteredInvoices = paidInvoices.filter(inv => {
          const dueDate = parseISO(inv.due_date)
          return isWithinInterval(dueDate, { start: monthStart, end: monthEnd })
        })
        break

      case 'custom':
        if (customDateRange.start && customDateRange.end) {
          const rangeStart = startOfDay(parseISO(customDateRange.start))
          const rangeEnd = endOfDay(parseISO(customDateRange.end))
          filteredInvoices = paidInvoices.filter(inv => {
            const dueDate = parseISO(inv.due_date)
            return isWithinInterval(dueDate, { start: rangeStart, end: rangeEnd })
          })
        } else {
          return 0
        }
        break

      case 'all':
      default:
        // All paid invoices
        break
    }

    return filteredInvoices.reduce((sum, inv) => sum + inv.total, 0)
  }, [invoices, period, customDateRange])

  const getPeriodLabel = () => {
    switch (period) {
      case 'today':
        return "Today's revenue"
      case 'week':
        return "This week's revenue"
      case 'month':
        return "This month's revenue"
      case 'custom':
        if (customDateRange.start && customDateRange.end) {
          return `${customDateRange.start} to ${customDateRange.end}`
        }
        return "Select date range"
      case 'all':
      default:
        return "All time revenue"
    }
  }

  const handleCustomRangeApply = () => {
    if (customDateRange.start && customDateRange.end) {
      setPeriod('custom')
      setShowCustomRange(false)
    }
  }

  return (
    <NestCard className="animate-nest-settle" style={{ animationDelay: '0.1s' }}>
      <NestCardHeader>
        <div className="flex items-center justify-between">
          <NestCardTitle className="text-sm font-medium text-muted-foreground">
            Total Revenue
          </NestCardTitle>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-muted-foreground" />

            {/* Period Selector Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-muted rounded transition-colors">
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setPeriod('today')}>
                  <span className={period === 'today' ? 'font-semibold' : ''}>Today</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPeriod('week')}>
                  <span className={period === 'week' ? 'font-semibold' : ''}>This Week</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPeriod('month')}>
                  <span className={period === 'month' ? 'font-semibold' : ''}>This Month</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPeriod('all')}>
                  <span className={period === 'all' ? 'font-semibold' : ''}>All Time</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Popover open={showCustomRange} onOpenChange={setShowCustomRange}>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className={period === 'custom' ? 'font-semibold' : ''}>Custom Range</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-sm">Select Date Range</h4>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                            <Input
                              id="start-date"
                              type="date"
                              value={customDateRange.start}
                              onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="end-date" className="text-xs">End Date</Label>
                            <Input
                              id="end-date"
                              type="date"
                              value={customDateRange.end}
                              onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <NestButton
                            size="sm"
                            variant="outline"
                            onClick={() => setShowCustomRange(false)}
                          >
                            Cancel
                          </NestButton>
                          <NestButton
                            size="sm"
                            onClick={handleCustomRangeApply}
                            disabled={!customDateRange.start || !customDateRange.end}
                          >
                            Apply
                          </NestButton>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </NestCardHeader>
      <NestCardContent>
        <div className="text-3xl font-bold text-accent">{formatCurrency(getRevenueForPeriod)}</div>
        <p className="text-sm text-muted-foreground mt-1">{getPeriodLabel()}</p>
      </NestCardContent>
    </NestCard>
  )
}
