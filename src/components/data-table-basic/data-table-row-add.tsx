"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
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

interface DataTableRowAddProps<TData> {
  table: Table<TData>
  createAction: (data: Partial<TData>) => Promise<{ success: boolean; error?: string }>
}

export default function DataTableRowAdd<TData>({
  table,
  createAction,
}: DataTableRowAddProps<TData>) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<TData>>({})

  const editableColumns: Column<TData, unknown>[] = table
    .getAllColumns()
    .filter((col) => col.columnDef.meta?.fieldType)

  const handleChange = (name: keyof TData, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const result = await createAction(formData)
      if (result.success) {
        toast.success("Row added", {
          description: "New item has been added successfully.",
        })
        router.refresh()
        setOpen(false)
        setFormData({})
      } else {
        toast.error("Creation failed", {
          description: result.error || "An unknown error occurred.",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
      toast.error("Creation failed", {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="size-4 shrink-0" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new item.
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
                  <Select onValueChange={(value) => handleChange(col.id as keyof TData, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={col.columnDef.meta?.placeholder} />
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
                    placeholder={col.columnDef.meta?.placeholder}
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
              {isSubmitting ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 