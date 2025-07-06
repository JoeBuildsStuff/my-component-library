"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export interface DataTableRowDeleteProps {
  selectedRowIds: string[]
  deleteAction: (ids: string[]) => Promise<{ success: boolean; error?: string; deletedCount?: number }>
  onComplete?: () => void
}

export default function DataTableRowDelete({ 
  selectedRowIds, 
  deleteAction,
  onComplete 
}: DataTableRowDeleteProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const result = await deleteAction(selectedRowIds)
      
      if (result.success) {
        toast.success("Row deleted", {
          description: `${result.deletedCount || selectedRowIds.length} row(s) have been deleted.`,
        })
        router.refresh()
        onComplete?.()
        setOpen(false)
      } else {
        toast.error("Deletion failed", {
          description: result.error || "An unknown error occurred.",
        })
        console.error("Failed to delete rows:", result.error)
      }
    } catch (error) {
      toast.error("Deletion failed", {
        description: "An unexpected error occurred while deleting the rows.",
      })
      console.error("Error deleting rows:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (selectedRowIds.length === 0) {
    return null
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Trash2 className="size-4 shrink-0" />
          <Badge variant="secondary">{selectedRowIds.length}</Badge>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="flex items-center gap-2">
              Delete <Badge variant="secondary">{selectedRowIds.length}</Badge> {selectedRowIds.length === 1 ? "Item" : "Items"}
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {selectedRowIds.length} selected row
            {selectedRowIds.length === 1 ? "" : "s"}? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              "Deleting..."
            ) : (
              <div className="flex items-center gap-1">
                Delete <Badge variant="outline">{selectedRowIds.length}</Badge> {selectedRowIds.length === 1 ? "Item" : "Items"}
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 