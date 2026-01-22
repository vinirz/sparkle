import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { CollectionCard } from "./_components/collection-card"
import CollectionModal from "../_components/collection-modal"
import { FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function Collections() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  const { data: collections } = await supabase
    .from("collections")
    .select("*, questions(count)")
    .order("created_at", { ascending: false })

  return (
            <main className="flex-1 h-full w-full overflow-y-auto">
                <div className="p-8 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger />
                            <Separator orientation="vertical" className="h-6" />
                            <h1 className="text-2xl font-bold">Minhas Coleções</h1>
                        </div>
                        <CollectionModal>
                            <Button>
                                <FolderPlus className="mr-2 h-4 w-4" />
                                Nova Coleção
                            </Button>
                        </CollectionModal>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {collections?.map((collection) => (
                            <CollectionCard key={collection.id} collection={collection} />
                        ))}
                    </div>

                    {collections?.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                            <FolderPlus className="h-10 w-10 mb-4 opacity-20" />
                            <p>Nenhuma coleção encontrada.</p>
                            <p className="text-sm">Crie sua primeira coleção para começar.</p>
                        </div>
                    )}
                </div>
            </main>
  )
}