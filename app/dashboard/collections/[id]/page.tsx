import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { DataTable } from "../../_components/questions-table/data-table"
import { columns } from "../../_components/questions-table/columns"
import { QuestionDialog } from "../../_components/questions-table/question-dialog"

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single()

  if (!collection) {
    notFound()
  }

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .eq("collection_id", id)
    .order("created_at", { ascending: false })

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{collection.name}</h2>
          <p className="text-muted-foreground">
            Gerencie as questões desta coleção.
          </p>
        </div>
        <QuestionDialog collectionId={collection.id} />
      </div>
      
      <div className="rounded-md bg-white dark:bg-neutral-900">
         <DataTable columns={columns} data={questions || []} />
      </div>
    </div>
  )
}
