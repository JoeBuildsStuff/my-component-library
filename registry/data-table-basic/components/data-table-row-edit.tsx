"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {  PencilRuler } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, Column } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

interface DataTableRowEditProps<TData> {
  table: Table<TData>
  updateAction: (id: string, data: Partial<TData>) => Promise<{ success: boolean; error?: string }>
  onComplete?: () => void
}

export default function DataTableRowEdit<TData extends { id: string }>({ 
  table,
  updateAction,
  onComplete 
}: DataTableRowEditProps<TData>) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<TData>>({})

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const isMultipleRows = selectedRows.length > 1
  const isSingleRow = selectedRows.length === 1

  const editableColumns: Column<TData, unknown>[] = table
    .getAllColumns()
    .filter((col) => col.columnDef.meta?.fieldType)

  useEffect(() => {
    if (isSingleRow) {
      // For single row, pre-fill with existing data
      setFormData(selectedRows[0].original)
    } else {
      // For multiple rows, start with empty form
      setFormData({})
    }
  }, [selectedRows, isSingleRow])

  const handleChange = (name: keyof TData, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (selectedRows.length === 0) return
    
    setIsSubmitting(true)
    
    try {
      // Filter out the id field from formData since it's an identity column
      const updateData = { ...formData }
      delete updateData.id

      // Only include fields that have values (for multi-row editing)
      const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([, value]) => value !== undefined && value !== "")
      ) as Partial<TData>

      if (Object.keys(filteredUpdateData).length === 0) {
        toast.error("No changes to apply", {
          description: "Please fill in at least one field to update.",
        })
        setIsSubmitting(false)
        return
      }

      let successCount = 0
      let errorCount = 0
      let lastError = ""

      // Update each selected row
      for (const row of selectedRows) {
        try {
          const result = await updateAction(row.original.id, filteredUpdateData)
          if (result.success) {
            successCount++
          } else {
            errorCount++
            lastError = result.error || "Unknown error"
          }
        } catch (error) {
          errorCount++
          lastError = error instanceof Error ? error.message : "Unexpected error"
        }
      }

      // Show appropriate toast message
      if (errorCount === 0) {
        const message = isMultipleRows 
          ? `${successCount} rows updated`
          : "Row updated"
        const description = isMultipleRows
          ? `${successCount} items have been updated successfully.`
          : "Item has been updated successfully."
        
        toast.success(message, { description })
        router.refresh()
        setOpen(false)
        onComplete?.()
      } else if (successCount === 0) {
        toast.error("Update failed", {
          description: lastError,
        })
      } else {
        toast.warning("Partial update", {
          description: `${successCount} rows updated, ${errorCount} failed. Last error: ${lastError}`,
        })
        router.refresh()
        setOpen(false)
        onComplete?.()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
      toast.error("Update failed", {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (selectedRows.length === 0) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PencilRuler className="size-4 shrink-0" />
          <Badge variant="secondary">{selectedRows.length}</Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              Edit <Badge variant="secondary">{selectedRows.length}</Badge> {selectedRows.length === 1 ? "Item" : "Items"}
            </div>
          </DialogTitle>
          <DialogDescription>
            {isMultipleRows 
              ? `Update the fields below to apply changes to all ${selectedRows.length} selected items. Only filled fields will be updated.`
              : "Update the item details below."
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
          {editableColumns.map((col) => (
              <div key={col.id} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={col.id} className="text-right">
                  {col.columnDef.meta?.label || col.id}
                </Label>
                <div className="col-span-3">
                {col.columnDef.meta?.fieldType === "select" ? (
                  <Select 
                    onValueChange={(value) => handleChange(col.id as keyof TData, value)}
                    value={formData[col.id as keyof TData] as string | undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        isMultipleRows 
                          ? `Select new ${col.columnDef.meta?.label || col.id}...`
                          : col.columnDef.meta?.placeholder
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {(col.columnDef.meta?.options as (string | { value: string; label: string })[])?.map((option) => (
                        <SelectItem
                          key={typeof option === 'string' ? option : option.value}
                          value={typeof option === 'string' ? option : option.value}
                        >
                          {typeof option === 'string' ? option : option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={col.id}
                    type={col.columnDef.meta?.fieldType || "text"}
                    placeholder={
                      isMultipleRows 
                        ? `New ${col.columnDef.meta?.label || col.id}...`
                        : col.columnDef.meta?.placeholder
                    }
                    value={(formData[col.id as keyof TData] as string) || ""}
                    onChange={(e) => handleChange(col.id as keyof TData, e.target.value)}
                    className="col-span-3"
                  />
                )}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Updating..."
              ) : (
                <div className="flex items-center gap-1">
                  Update <Badge variant="secondary">{selectedRows.length}</Badge> {selectedRows.length === 1 ? "Item" : "Items"}
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 