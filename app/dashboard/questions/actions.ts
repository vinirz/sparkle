"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const questionSchema = z.object({
  statement: z.string().min(1, "O enunciado é obrigatório"),
  statement_image_url: z.string().nullable().optional(),
  type: z.enum(["objective", "discursive"]),
  correct_answer: z.string().min(1, "A resposta correta é obrigatória"),
  resolution: z.string().optional(),
  subject: z.string().min(1, "A matéria é obrigatória"),
  institution: z.string().optional(),
  exam: z.string().optional(),
  year: z.coerce.number().optional(),
  topic: z.string().optional(),
  subtopic: z.string().optional(),
  collection_id: z.string().uuid(),
})

export type QuestionSchema = z.infer<typeof questionSchema>

export async function createQuestion(data: QuestionSchema) {
  const result = questionSchema.safeParse(data)
  
  if (!result.success) {
    return { error: result.error.flatten() }
  }

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from("questions")
    .insert({
      ...result.data,
      user_id: user.id
    })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/dashboard/collections/${data.collection_id}`)
  revalidatePath(`/dashboard/questions`)
}

export async function deleteQuestion(id: string, collectionId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/dashboard/collections/${collectionId}`)
  revalidatePath(`/dashboard/questions`)
}

export async function updateQuestion(id: string, collectionId: string, data: QuestionSchema) {
  const result = questionSchema.safeParse(data)
  
  if (!result.success) {
    return { error: result.error.flatten() }
  }

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase
    .from("questions")
    .update({
      ...result.data,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/dashboard/collections/${collectionId}`)
  revalidatePath(`/dashboard/questions`)
}

export async function getCollectionMetadata(collectionId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      subjects: [],
      institutions: [],
      exams: [],
      topics: [],
      subtopics: [],
      years: [],
    }
  }

  // Buscar apenas as colunas de metadados da coleção
  const { data } = await supabase
    .from('questions')
    .select('subject, institution, exam, topic, subtopic, year')
    .eq('collection_id', collectionId)
    .eq('user_id', user.id)

  if (!data) return {
    subjects: [],
    institutions: [],
    exams: [],
    topics: [],
    subtopics: [],
    years: [],
  }

  // Extrair valores únicos
  const uniqueMetadata = {
    subjects: [...new Set((data as any[]).map(q => q.subject).filter(Boolean))],
    institutions: [...new Set((data as any[]).map(q => q.institution).filter(Boolean))],
    exams: [...new Set((data as any[]).map(q => q.exam).filter(Boolean))],
    topics: [...new Set((data as any[]).map(q => q.topic).filter(Boolean))],
    subtopics: [...new Set((data as any[]).map(q => q.subtopic).filter(Boolean))],
    years: [...new Set((data as any[]).map(q => q.year).filter((val: any) => val !== null && val !== undefined))],
  }

  return uniqueMetadata
}
