"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { NestButton } from "@/components/nest/nest-button"
import { NestCard } from "@/components/nest/nest-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Edit2, Check, X } from "lucide-react"
import { useLineItemsStore, SavedLineItem } from "@/lib/store/line-items-store"
import { formatCurrency } from "@/lib/utils/calculations"

interface SavedItemsDialogProps {
  open: boolean
  onClose: () => void
  onSelectItem: (item: SavedLineItem) => void
}

export function SavedItemsDialog({ open, onClose, onSelectItem }: SavedItemsDialogProps) {
  const { savedItems, addSavedItem, updateSavedItem, removeSavedItem } = useLineItemsStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newItem, setNewItem] = useState({
    description: '',
    rate: '',
    default_quantity: '1',
    category: ''
  })
  const [editItem, setEditItem] = useState({
    description: '',
    rate: '',
    default_quantity: '',
    category: ''
  })

  const handleAddItem = () => {
    if (!newItem.description || !newItem.rate) return

    addSavedItem({
      description: newItem.description,
      rate: parseFloat(newItem.rate),
      default_quantity: parseFloat(newItem.default_quantity) || 1,
      category: newItem.category || undefined
    })

    setNewItem({ description: '', rate: '', default_quantity: '1', category: '' })
  }

  const handleStartEdit = (item: SavedLineItem) => {
    setEditingId(item.id)
    setEditItem({
      description: item.description,
      rate: item.rate.toString(),
      default_quantity: item.default_quantity.toString(),
      category: item.category || ''
    })
  }

  const handleSaveEdit = () => {
    if (!editingId || !editItem.description || !editItem.rate) return

    updateSavedItem(editingId, {
      description: editItem.description,
      rate: parseFloat(editItem.rate),
      default_quantity: parseFloat(editItem.default_quantity) || 1,
      category: editItem.category || undefined
    })

    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Saved Line Items</DialogTitle>
          <DialogDescription>
            Manage your frequently used products and services. Click an item to add it to your invoice.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add New Item */}
          <NestCard className="p-4">
            <h3 className="font-semibold mb-3">Add New Item</h3>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-5">
                <Label htmlFor="new-description">Description</Label>
                <Input
                  id="new-description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Service or product name"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="new-rate">Rate</Label>
                <Input
                  id="new-rate"
                  type="number"
                  step="0.01"
                  value={newItem.rate}
                  onChange={(e) => setNewItem({ ...newItem, rate: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="new-quantity">Default Qty</Label>
                <Input
                  id="new-quantity"
                  type="number"
                  step="0.01"
                  value={newItem.default_quantity}
                  onChange={(e) => setNewItem({ ...newItem, default_quantity: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="new-category">Category</Label>
                <Input
                  id="new-category"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <div className="col-span-1 flex items-end">
                <NestButton
                  type="button"
                  size="sm"
                  onClick={handleAddItem}
                  disabled={!newItem.description || !newItem.rate}
                >
                  <Plus className="w-4 h-4" />
                </NestButton>
              </div>
            </div>
          </NestCard>

          {/* Saved Items List */}
          <div className="space-y-2">
            <h3 className="font-semibold">Your Saved Items ({savedItems.length})</h3>
            {savedItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No saved items yet. Add your first item above!
              </p>
            ) : (
              <div className="space-y-2">
                {savedItems.map((item) => (
                  <NestCard
                    key={item.id}
                    className="p-3 cursor-pointer hover:border-primary transition-colors"
                  >
                    {editingId === item.id ? (
                      // Edit Mode
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-5">
                          <Input
                            value={editItem.description}
                            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                            placeholder="Description"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={editItem.rate}
                            onChange={(e) => setEditItem({ ...editItem, rate: e.target.value })}
                            placeholder="Rate"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={editItem.default_quantity}
                            onChange={(e) => setEditItem({ ...editItem, default_quantity: e.target.value })}
                            placeholder="Quantity"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            value={editItem.category}
                            onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                            placeholder="Category"
                          />
                        </div>
                        <div className="col-span-1 flex gap-1">
                          <NestButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleSaveEdit}
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </NestButton>
                          <NestButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            <X className="w-4 h-4 text-destructive" />
                          </NestButton>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div
                        className="grid grid-cols-12 gap-3 items-center"
                        onClick={() => onSelectItem(item)}
                      >
                        <div className="col-span-5">
                          <div className="font-medium">{item.description}</div>
                          {item.category && (
                            <div className="text-xs text-muted-foreground">{item.category}</div>
                          )}
                        </div>
                        <div className="col-span-2 text-sm text-muted-foreground">
                          {formatCurrency(item.rate)}
                        </div>
                        <div className="col-span-2 text-sm text-muted-foreground">
                          Qty: {item.default_quantity}
                        </div>
                        <div className="col-span-2 text-sm font-semibold text-primary">
                          {formatCurrency(item.rate * item.default_quantity)}
                        </div>
                        <div className="col-span-1 flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <NestButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEdit(item)}
                          >
                            <Edit2 className="w-3 h-3" />
                          </NestButton>
                          <NestButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSavedItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3 text-destructive" />
                          </NestButton>
                        </div>
                      </div>
                    )}
                  </NestCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
