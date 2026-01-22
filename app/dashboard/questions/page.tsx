import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { DataTable } from "../_components/questions-table/data-table"
import { columns } from "../_components/questions-table/columns"

export default async function AllQuestionsPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Fetch all questions for the user (RLS restricted)
  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Todas as Questões</h2>
          <p className="text-muted-foreground">
            Visualize e gerencie todas as suas questões aqui.
          </p>
        </div>
      </div>
      
      <div className="rounded-md bg-white dark:bg-neutral-900">
         <DataTable columns={columns} data={questions || []} />
      </div>
    </div>
  )
}
