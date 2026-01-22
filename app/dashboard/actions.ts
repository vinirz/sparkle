'use server'

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createCollection(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error("Unauthorized")
  }

  const name = formData.get("name") as string

  if (!name) {
    throw new Error("Name is required")
  }

  const { error } = await supabase.from("collections").insert({
    name,
    user_id: user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
}

export async function deleteCollection(id: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/collections")
}

export async function updateCollection(id: string, name: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from("collections")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/collections")
}
