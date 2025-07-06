import { DataTable } from "@/components/data-table-basic/data-table"
import { columns } from "./_components/columns-payments"
import { getPayments } from "./_lib/queries"
import { parseSearchParams } from "@/lib/data-table"
import { createPayment, updatePayment, deletePayments } from "./_lib/actions"


export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const tableState = parseSearchParams(params)
  const page = (tableState.pagination?.pageIndex ?? 0) + 1 // Convert 0-based to 1-based
  const pageSize = tableState.pagination?.pageSize ?? 10
  const sorting = tableState.sorting ?? []

  const { data: payments, totalCount } = await getPayments(page, pageSize, sorting)
 
  return (
    <div className="container mx-auto py-10">
      <DataTable 
        columns={columns} 
        data={payments} 
        searchParams={params}
        totalCount={totalCount}
        createAction={createPayment}
        updateAction={updatePayment}
        deleteAction={deletePayments}
      />
    </div>
  )
}