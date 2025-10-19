"use client"

import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"
import { Invoice, InvoiceStatus } from "@/lib/types"

interface StatusChartProps {
  invoices: Invoice[]
}

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: '#9ca3af',
  sent: '#3b82f6',
  paid: '#f59e0b',
  overdue: '#f97316',
  cancelled: '#ef4444',
}

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
}

export function StatusChart({ invoices }: StatusChartProps) {
  // Calculate status breakdown
  const statusCounts: Record<string, number> = invoices.reduce((acc, inv) => {
    acc[inv.status] = (acc[inv.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: STATUS_LABELS[status as InvoiceStatus],
    value: count,
    color: STATUS_COLORS[status as InvoiceStatus],
  }))

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No invoices to display
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                  <p className="text-sm font-medium">{payload[0].name}</p>
                  <p className="text-lg font-bold">{payload[0].value} invoices</p>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
