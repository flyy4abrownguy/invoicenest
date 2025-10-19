'use client';

import { useState } from 'react';
import { InvoiceTemplate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';

interface TemplateDialogProps {
  template?: InvoiceTemplate;
  onSave: (template: Partial<InvoiceTemplate>) => Promise<void>;
  trigger?: React.ReactNode;
}

export function TemplateDialog({ template, onSave, trigger }: TemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: template?.name || '',
    description: template?.description || '',
    theme_color: template?.theme_color || '#3B82F6',
    font_family: template?.font_family || 'Inter',
    logo_position: template?.logo_position || 'left',
    default_payment_terms: template?.default_payment_terms || 30,
    default_tax_rate: template?.default_tax_rate || 0,
    default_notes: template?.default_notes || '',
    is_default: template?.is_default || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      setOpen(false);
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{template ? 'Edit Template' : 'Create Template'}</DialogTitle>
            <DialogDescription>
              Create a reusable template for your invoices with custom styling and default
              values.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Template Name*</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Professional Services"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of when to use this template"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="theme_color">Theme Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="theme_color"
                    type="color"
                    value={formData.theme_color}
                    onChange={(e) =>
                      setFormData({ ...formData, theme_color: e.target.value })
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.theme_color}
                    onChange={(e) =>
                      setFormData({ ...formData, theme_color: e.target.value })
                    }
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="logo_position">Logo Position</Label>
                <select
                  id="logo_position"
                  value={formData.logo_position}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      logo_position: e.target.value as 'left' | 'center' | 'right',
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="payment_terms">Default Payment Terms (days)</Label>
                <Input
                  id="payment_terms"
                  type="number"
                  value={formData.default_payment_terms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      default_payment_terms: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tax_rate">Default Tax Rate (%)</Label>
                <Input
                  id="tax_rate"
                  type="number"
                  step="0.01"
                  value={formData.default_tax_rate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      default_tax_rate: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="default_notes">Default Notes</Label>
              <Textarea
                id="default_notes"
                value={formData.default_notes}
                onChange={(e) => setFormData({ ...formData, default_notes: e.target.value })}
                placeholder="Default notes that appear on invoices using this template"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_default"
                checked={formData.is_default}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_default: checked as boolean })
                }
              />
              <Label htmlFor="is_default" className="cursor-pointer">
                Set as default template
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
