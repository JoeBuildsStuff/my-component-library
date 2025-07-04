"use client"

import { useState } from "react"
import { PencilRuler } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DataTableRowForm } from "./data-table-row-form"
import { ColumnDef } from "@tanstack/react-table"

interface DataTableRowEditProps<TData> {
  columns: ColumnDef<TData>[]
  selectedRows: TData[]
  updateAction?: (id: string, data: Partial<TData>) => Promise<{ success: boolean; error?: string }>
}

export default function DataTableRowEdit<TData>({ columns, selectedRows, updateAction }: DataTableRowEditProps<TData>) {
  const [open, setOpen] = useState(false)

  // Only allow editing if exactly one row is selected
  const canEdit = selectedRows.length === 1
  const editingRow = canEdit ? selectedRows[0] : undefined

  const handleSuccess = () => {
    setOpen(false)
    toast.success("Row updated", {
      description: "The row has been updated successfully.",
    })
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" disabled={!canEdit}>
          <PencilRuler className="size-4 shrink-0" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit Row</SheetTitle>
          <SheetDescription>Edit the selected row in the table.</SheetDescription>
        </SheetHeader>
        
        {canEdit && editingRow && (
          <div className="flex-1 overflow-hidden">
            <DataTableRowForm
              columns={columns as ColumnDef<Record<string, unknown>>[]}
              data={editingRow}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
              updateAction={updateAction as ((id: string, data: Partial<Record<string, unknown>>) => Promise<{ success: boolean; error?: string }>) | undefined}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}