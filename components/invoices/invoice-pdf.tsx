"use client"

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { Invoice, Profile } from '@/lib/types'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/utils/calculations'

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
  },
  logoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 60,
    objectFit: 'contain',
  },
  companyInfo: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d9488',
    marginBottom: 4,
  },
  companyDetails: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0d9488',
    marginBottom: 10,
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  infoSection: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
  },
  clientSection: {
    backgroundColor: '#f5f5f4',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
  },
  clientLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  clientName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  clientDetails: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0d9488',
    padding: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e7e5e4',
    padding: 10,
  },
  tableCell: {
    fontSize: 10,
    color: '#333',
  },
  descriptionCol: {
    flex: 3,
  },
  quantityCol: {
    flex: 1,
    textAlign: 'center',
  },
  rateCol: {
    flex: 1,
    textAlign: 'right',
  },
  amountCol: {
    flex: 1,
    textAlign: 'right',
  },
  totalsSection: {
    marginLeft: 'auto',
    width: 250,
    marginTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 11,
    color: '#666',
  },
  totalValue: {
    fontSize: 11,
    color: '#333',
    fontWeight: 'bold',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#0d9488',
    marginTop: 10,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d9488',
  },
  notesSection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fafaf9',
    borderRadius: 4,
  },
  notesLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  notesText: {
    fontSize: 10,
    color: '#666',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e7e5e4',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 9,
    color: '#999',
    textAlign: 'center',
  },
  watermark: {
    fontSize: 8,
    color: '#14b8a6',
    textAlign: 'center',
    marginTop: 5,
  },
})

interface InvoicePDFProps {
  invoice: Invoice
  profile: Profile
  isPro?: boolean
}

export function InvoicePDF({ invoice, profile, isPro = false }: InvoicePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <View>
              {profile.company_logo ? (
                <Image src={profile.company_logo} style={styles.logo} />
              ) : (
                <Text style={styles.companyName}>{profile.company_name || 'Your Company'}</Text>
              )}
            </View>
            <View style={styles.companyInfo}>
              {profile.company_name && !profile.company_logo && (
                <Text style={styles.companyName}>{profile.company_name}</Text>
              )}
              {profile.company_email && (
                <Text style={styles.companyDetails}>{profile.company_email}</Text>
              )}
              {profile.company_phone && (
                <Text style={styles.companyDetails}>{profile.company_phone}</Text>
              )}
              {profile.company_address && (
                <Text style={styles.companyDetails}>{profile.company_address}</Text>
              )}
            </View>
          </View>
        </View>

        <Text style={styles.invoiceTitle}>INVOICE</Text>

        {/* Invoice Info */}
        <View style={styles.invoiceInfo}>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Invoice Number</Text>
            <Text style={styles.infoValue}>{invoice.invoice_number}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Issue Date</Text>
            <Text style={styles.infoValue}>{format(new Date(invoice.issue_date), 'MMM dd, yyyy')}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.infoLabel}>Due Date</Text>
            <Text style={styles.infoValue}>{format(new Date(invoice.due_date), 'MMM dd, yyyy')}</Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.clientSection}>
          <Text style={styles.clientLabel}>Bill To</Text>
          <Text style={styles.clientName}>{invoice.client?.name || 'Client Name'}</Text>
          {invoice.client?.email && (
            <Text style={styles.clientDetails}>{invoice.client.email}</Text>
          )}
          {invoice.client?.phone && (
            <Text style={styles.clientDetails}>{invoice.client.phone}</Text>
          )}
          {invoice.client?.address && (
            <Text style={styles.clientDetails}>{invoice.client.address}</Text>
          )}
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.descriptionCol]}>Description</Text>
            <Text style={[styles.tableHeaderText, styles.quantityCol]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.rateCol]}>Rate</Text>
            <Text style={[styles.tableHeaderText, styles.amountCol]}>Amount</Text>
          </View>

          {invoice.items?.map((item, index) => (
            <View key={item.id || index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.descriptionCol]}>{item.description}</Text>
              <Text style={[styles.tableCell, styles.quantityCol]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.rateCol]}>{formatCurrency(item.rate)}</Text>
              <Text style={[styles.tableCell, styles.amountCol]}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
          </View>

          {invoice.tax_rate > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({invoice.tax_rate}%):</Text>
              <Text style={styles.totalValue}>{formatCurrency(invoice.tax_amount)}</Text>
            </View>
          )}

          {invoice.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={styles.totalValue}>-{formatCurrency(invoice.discount)}</Text>
            </View>
          )}

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(invoice.total)}</Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {invoice.payment_terms && (
          <View style={[styles.notesSection, { marginTop: 10 }]}>
            <Text style={styles.notesLabel}>Payment Terms</Text>
            <Text style={styles.notesText}>{invoice.payment_terms}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for your business!
          </Text>
          {!isPro && (
            <Text style={styles.watermark}>
              Created with InvoiceNest - invoicenest.com
            </Text>
          )}
        </View>
      </Page>
    </Document>
  )
}
