import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateInvoiceStatus } from '@/lib/db/invoice-actions'
import { InvoiceStatus } from '@/lib/types'

/**
 * PATCH /api/invoices/[id]/status
 * Update invoice status (mark as paid, sent, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { status } = body as { status: InvoiceStatus }

    // Validate status
    const validStatuses: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: draft, sent, paid, overdue, cancelled' },
        { status: 400 }
      )
    }

    // Update status
    const updatedInvoice = await updateInvoiceStatus(id, user.id, status)

    return NextResponse.json(updatedInvoice, { status: 200 })
  } catch (error) {
    console.error('Error updating invoice status:', error)
    return NextResponse.json(
      { error: 'Failed to update invoice status' },
      { status: 500 }
    )
  }
}
