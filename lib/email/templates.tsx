import { Invoice, Profile } from '@/lib/types'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/utils/calculations'

/**
 * Invoice Email Template
 * Professional HTML email template for sending invoices
 */
export function getInvoiceEmailTemplate(invoice: Invoice, profile: Profile) {
  const companyName = profile.company_name || 'InvoiceNest User'
  const clientName = invoice.client?.name || 'Valued Client'

  return {
    subject: `Invoice ${invoice.invoice_number} from ${companyName}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoice_number}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f4; color: #333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px; border-bottom: 1px solid #e7e5e4;">
              <h1 style="margin: 0; font-size: 28px; color: #0d9488; font-weight: 700;">
                Invoice ${invoice.invoice_number}
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 16px; color: #666;">
                from ${companyName}
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                Hi ${clientName},
              </p>
              <p style="margin: 16px 0 0 0; font-size: 16px; line-height: 1.6;">
                Thank you for your business! Please find your invoice attached to this email.
              </p>
            </td>
          </tr>

          <!-- Invoice Summary -->
          <tr>
            <td style="padding: 20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafaf9; border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #999; font-size: 14px;">Invoice Number:</span>
                    <strong style="display: block; font-size: 16px; margin-top: 4px;">${invoice.invoice_number}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #999; font-size: 14px;">Issue Date:</span>
                    <strong style="display: block; font-size: 16px; margin-top: 4px;">${format(new Date(invoice.issue_date), 'MMMM dd, yyyy')}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #999; font-size: 14px;">Due Date:</span>
                    <strong style="display: block; font-size: 16px; margin-top: 4px; color: #f59e0b;">${format(new Date(invoice.due_date), 'MMMM dd, yyyy')}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 0 8px 0; border-top: 2px solid #0d9488; margin-top: 12px;">
                    <span style="color: #999; font-size: 14px;">Amount Due:</span>
                    <strong style="display: block; font-size: 24px; margin-top: 4px; color: #0d9488;">${formatCurrency(invoice.total)}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Instructions -->
          ${invoice.payment_terms ? `
          <tr>
            <td style="padding: 20px 40px;">
              <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #333;">Payment Instructions:</h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #666;">
                ${invoice.payment_terms}
              </p>
            </td>
          </tr>
          ` : ''}

          <!-- Notes -->
          ${invoice.notes ? `
          <tr>
            <td style="padding: 20px 40px;">
              <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #333;">Notes:</h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #666;">
                ${invoice.notes}
              </p>
            </td>
          </tr>
          ` : ''}

          <!-- Contact Info -->
          <tr>
            <td style="padding: 30px 40px; background-color: #fafaf9; border-top: 1px solid #e7e5e4;">
              <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">
                Questions about this invoice? Contact us:
              </p>
              ${profile.company_email ? `
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #0d9488;">
                  Email: <a href="mailto:${profile.company_email}" style="color: #0d9488; text-decoration: none;">${profile.company_email}</a>
                </p>
              ` : ''}
              ${profile.company_phone ? `
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #666;">
                  Phone: ${profile.company_phone}
                </p>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e7e5e4;">
              <p style="margin: 0; font-size: 14px; color: #999;">
                Thank you for your business!
              </p>
              <p style="margin: 12px 0 0 0; font-size: 12px; color: #14b8a6;">
                This invoice was sent using <a href="https://invoicenest.com" style="color: #14b8a6; text-decoration: none;">InvoiceNest</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Invoice ${invoice.invoice_number}
From: ${companyName}

Hi ${clientName},

Thank you for your business! Please find your invoice details below:

Invoice Number: ${invoice.invoice_number}
Issue Date: ${format(new Date(invoice.issue_date), 'MMMM dd, yyyy')}
Due Date: ${format(new Date(invoice.due_date), 'MMMM dd, yyyy')}
Amount Due: ${formatCurrency(invoice.total)}

${invoice.payment_terms ? `Payment Instructions:\n${invoice.payment_terms}\n\n` : ''}
${invoice.notes ? `Notes:\n${invoice.notes}\n\n` : ''}

Questions? Contact us:
${profile.company_email ? `Email: ${profile.company_email}\n` : ''}
${profile.company_phone ? `Phone: ${profile.company_phone}\n` : ''}

Thank you for your business!

This invoice was sent using InvoiceNest - https://invoicenest.com
    `.trim(),
  }
}
