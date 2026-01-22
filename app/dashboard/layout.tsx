import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/sign-in")
  }

  // Fallback data if user metadata is missing
  const userData = {
    name: user.user_metadata?.name || user.email?.split("@")[0] || "Usuário",
    email: user.email || "",
    avatar: user.user_metadata?.avatar_url || "",
  }

  return (
    <div className="w-full h-full flex">
      <SidebarProvider className="w-full h-full">
        <AppSidebar user={userData} />
        {children}
      </SidebarProvider>
    </div>
  )
}
