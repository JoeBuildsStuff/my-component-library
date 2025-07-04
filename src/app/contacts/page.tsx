import DataTableAttioContacts from "./_components/contacts-table"

export default async function NewContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  return (
    <main className="px-3 py-10 w-full max-w-5xl mx-auto">
      <DataTableAttioContacts searchParams={params} />
    </main>
  )
}