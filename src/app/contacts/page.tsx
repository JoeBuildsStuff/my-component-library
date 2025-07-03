import DataTableExampleContacts from "@/app/contacts/_components/contacts-table";

export default async function DataTableExampleContactsPage2({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  return (
    <main className="px-3 py-10 w-full max-w-5xl mx-auto">
      <DataTableExampleContacts searchParams={params} />
    </main>
  )
}