import { Table } from "@tanstack/react-table"
import { DataTableViewOptions } from "./data-table-view-options"
import DataTableRowDelete from "./data-table-row-delete"
import DataTableRowAdd from "./data-table-row-add"
import DataTableRowEdit from "./data-table-row-edit"

interface DataTableToolbarProps<TData> {
  table: Table<TData>,
  createAction: (data: Partial<TData>) => Promise<{ success: boolean; error?: string }>,
  updateAction: (id: string, data: Partial<TData>) => Promise<{ success: boolean; error?: string }>,
  deleteAction: (ids: string[]) => Promise<{ success: boolean; error?: string; deletedCount?: number }>,
}

export default function DataTableToolbar<TData extends { id: string }>({ 
  table,
  createAction,
  updateAction,
  deleteAction,
}: DataTableToolbarProps<TData>) {
  const selectedRowIds = table.getFilteredSelectedRowModel().rows.map(row => row.original.id)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <DataTableRowAdd 
          table={table}
          createAction={createAction} 
        />
        <DataTableRowEdit
          table={table}
          updateAction={updateAction}
          onComplete={() => table.resetRowSelection()}
        />
        <DataTableRowDelete
          selectedRowIds={selectedRowIds}
          deleteAction={deleteAction}
          onComplete={() => table.resetRowSelection()}
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}