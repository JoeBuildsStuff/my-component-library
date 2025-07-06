"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  ColumnOrderState,
} from "@tanstack/react-table"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useState, useEffect } from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DataTableToolbar from "./data-table-toolbar"
import { DataTablePagination } from "./data-table-pagination"
import { parseSearchParams, serializeTableState, updateSearchParams as updateUrlSearchParams, DataTableState } from "@/lib/data-table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchParams: { [key: string]: string | string[] | undefined }
  totalCount: number
  createAction: (data: Partial<TData>) => Promise<{ success: boolean; error?: string }>
  updateAction: (id: string, data: Partial<TData>) => Promise<{ success: boolean; error?: string }>
  deleteAction: (ids: string[]) => Promise<{ success: boolean; error?: string; deletedCount?: number }>
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  searchParams,
  totalCount,
  createAction,
  updateAction,
  deleteAction,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const currentSearchParams = useSearchParams()

  // Parse initial state from search params
  const tableState = parseSearchParams(searchParams)
  const page = (tableState.pagination?.pageIndex ?? 0) + 1 // Convert 0-based to 1-based
  const pageSize = tableState.pagination?.pageSize ?? 10

  // State management for table features
  const [sorting, setSorting] = useState<SortingState>(tableState.sorting ?? [])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(tableState.columnVisibility ?? {})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(tableState.columnFilters ?? [])
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(tableState.columnOrder ?? [])

  // Sync state changes to URL
  useEffect(() => {
    const currentState: DataTableState = {
      pagination: {
        pageIndex: page - 1, // Convert to 0-based
        pageSize,
      },
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
    }

    const newParams = serializeTableState(currentState)
    const updatedSearchParams = updateUrlSearchParams(currentSearchParams, newParams)
    
    // Only update URL if parameters actually changed
    const currentUrl = `${pathname}?${currentSearchParams.toString()}`
    const newUrl = `${pathname}?${updatedSearchParams.toString()}`
    
    if (currentUrl !== newUrl) {
      router.replace(newUrl, { scroll: false })
    }
  }, [sorting, columnFilters, columnVisibility, columnOrder, page, pageSize, router, pathname, currentSearchParams])

  const updateSearchParams = useCallback(
    (updates: { page?: number; pageSize?: number }) => {
      const currentTableState = parseSearchParams(
        Object.fromEntries(currentSearchParams.entries())
      )
      
      // Update pagination state
      const newTableState = {
        pagination: {
          pageIndex: (updates.page ?? page) - 1, // Convert to 0-based
          pageSize: updates.pageSize ?? pageSize,
        },
        sorting: currentTableState.sorting ?? [],
        columnFilters: currentTableState.columnFilters ?? [],
        columnVisibility: currentTableState.columnVisibility ?? {},
        columnOrder: currentTableState.columnOrder ?? [],
      }
      
      const serializedParams = serializeTableState(newTableState)
      const newSearchParams = updateUrlSearchParams(currentSearchParams, serializedParams)
      const url = newSearchParams.toString()
      router.push(url ? `?${url}` : '?', { scroll: false })
    },
    [currentSearchParams, router, page, pageSize]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    rowCount: totalCount,
    enableRowSelection: true,
    getRowId: (row: TData) => (row as { id: string }).id, // Use the id field as row identifier
    state: {
      pagination: {
        pageIndex: page - 1, // Convert to 0-based index
        pageSize,
      },
      sorting,
      columnVisibility,
      columnFilters,
      columnOrder,
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' 
        ? updater({ pageIndex: page - 1, pageSize })
        : updater
      
      updateSearchParams({
        page: newPagination.pageIndex + 1, // Convert back to 1-based
        pageSize: newPagination.pageSize,
      })
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onColumnOrderChange: setColumnOrder,
  })

  return (
    <div className="space-y-2">
      <div className="">
        <DataTableToolbar 
          table={table} 
          createAction={createAction}
          updateAction={updateAction}
          deleteAction={deleteAction}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}