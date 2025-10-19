"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { formatCurrency } from "@/lib/utils/calculations"
import { Invoice } from "@/lib/types"
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from "date-fns"

interface RevenueChartProps {
  invoices: Invoice[]
}

export function RevenueChart({ invoices }: RevenueChartProps) {
  // Get last 6 months
  const now = new Date()
  const months = eachMonthOfInterval({
    start: subMonths(now, 5),
    end: now,
  })

  // Calculate revenue per month
  const data = months.map((month) => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)

    const monthRevenue = invoices
      .filter((inv) => {
        const invoiceDate = new Date(inv.issue_date)
        return invoiceDate >= monthStart && invoiceDate <= monthEnd && inv.status === 'paid'
      })
      .reduce((sum, inv) => sum + inv.total, 0)

    return {
      month: format(month, 'MMM yyyy'),
      revenue: monthRevenue,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
        <XAxis
          dataKey="month"
          stroke="#999"
          fontSize={12}
        />
        <YAxis
          stroke="#999"
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                  <p className="text-sm font-medium">{payload[0].payload.month}</p>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(payload[0].value as number)}
                  </p>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#0d9488"
          strokeWidth={3}
          dot={{ fill: '#0d9488', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
