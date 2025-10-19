'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Invoice, Profile } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils/calculations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, CreditCard, CheckCircle2 } from 'lucide-react';

export default function PortalPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/portal/share/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('Invoice not found or link expired');
        return res.json();
      })
      .then((data) => {
        setInvoice(data.invoice);
        setProfile(data.profile);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || 'Invoice not found'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPaid = invoice.status === 'paid';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              {profile.company_logo && (
                <img
                  src={profile.company_logo}
                  alt={profile.company_name || ''}
                  className="h-12 mb-4"
                />
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.company_name || profile.full_name}
              </h1>
              {profile.company_address && (
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                  {profile.company_address}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Invoice</p>
              <p className="text-xl font-bold">{invoice.invoice_number}</p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
              <p className="text-gray-700">{invoice.client?.name}</p>
              {invoice.client?.email && (
                <p className="text-sm text-gray-600">{invoice.client.email}</p>
              )}
              {invoice.client?.address && (
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {invoice.client.address}
                </p>
              )}
            </div>
            <div>
              <div className="mb-3">
                <p className="text-sm text-gray-600">Issue Date</p>
                <p className="font-medium">{formatDate(invoice.issue_date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="font-medium">{formatDate(invoice.due_date)}</p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          {isPaid && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">This invoice has been paid</span>
            </div>
          )}

          {/* Line Items */}
          <div className="mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-2 text-sm font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="text-right py-2 text-sm font-semibold text-gray-700">Qty</th>
                  <th className="text-right py-2 text-sm font-semibold text-gray-700">Rate</th>
                  <th className="text-right py-2 text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 text-gray-700">{item.description}</td>
                    <td className="py-3 text-right text-gray-700">{item.quantity}</td>
                    <td className="py-3 text-right text-gray-700">
                      {formatCurrency(item.rate, invoice.currency)}
                    </td>
                    <td className="py-3 text-right text-gray-700">
                      {formatCurrency(item.amount, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>
              {invoice.tax_rate > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax ({invoice.tax_rate}%)</span>
                  <span className="font-medium">
                    {formatCurrency(invoice.tax_amount, invoice.currency)}
                  </span>
                </div>
              )}
              {invoice.discount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium">
                    -{formatCurrency(invoice.discount, invoice.currency)}
                  </span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between py-2">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isPaid && (
          <div className="flex gap-4">
            <Button className="flex-1" size="lg">
              <CreditCard className="mr-2 h-5 w-5" />
              Pay Now
            </Button>
            <Button variant="outline" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Download PDF
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            Questions about this invoice? Contact {profile.company_email || profile.email}
          </p>
        </div>
      </div>
    </div>
  );
}
