"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { updateQuestion, createQuestion } from "@/app/dashboard/questions/actions"
import { Question } from "./columns" // We will need to make sure this is exported or redefined
import { useEffect } from "react"

// ... imports remain the same

const formSchema = z.object({
  statement: z.string().min(1, "O enunciado é obrigatório"),
  type: z.enum(["objective", "discursive"]),
  correct_answer: z.string().min(1, "A resposta correta é obrigatória"),
  resolution: z.string().optional(),
  subject: z.string().min(1, "A matéria é obrigatória"),
  institution: z.string().optional(),
  exam: z.string().optional(),
  year: z.coerce.number().optional(),
  topic: z.string().optional(),
  subtopic: z.string().optional(),
})

interface QuestionDialogProps {
  collectionId: string
  question?: Question
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function QuestionDialog({ collectionId, question, children, open: controlledOpen, onOpenChange: setControlledOpen }: QuestionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? setControlledOpen : setInternalOpen

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      statement: "",
      type: "objective",
      correct_answer: "",
      resolution: "",
      subject: "",
      institution: "",
      exam: "",
      year: 0,
      topic: "",
      subtopic: "",
    },
  })

  // Reset form when dialog opens or question changes
  useEffect(() => {
    if (open) {
        if (question) {
            form.reset({
                originalData: question, // Keep track if needed, or just map fields
                statement: question.statement,
                type: question.type,
                correct_answer: question.correct_answer,
                resolution: question.resolution || "",
                subject: question.subject,
                institution: question.institution || "",
                exam: question.exam || "",
                year: question.year || 0,
                topic: question.topic || "",
                subtopic: question.subtopic || "",
            } as any)
        } else {
            form.reset({
                statement: "",
                type: "objective",
                correct_answer: "",
                resolution: "",
                subject: "",
                institution: "",
                exam: "",
                year: 0,
                topic: "",
                subtopic: "",
            })
        }
    }
  }, [open, question, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const submissionData = {
            ...values,
            collection_id: collectionId,
            year: values.year === 0 ? undefined : values.year
        }
        
        if (question) {
            await updateQuestion(question.id, collectionId, submissionData)
            toast.success("Questão atualizada com sucesso!")
        } else {
            await createQuestion(submissionData)
            toast.success("Questão criada com sucesso!")
        }
        
        if (setOpen) setOpen(false)
        form.reset()
      } catch (error) {
        toast.error(question ? "Erro ao atualizar questão." : "Erro ao criar questão.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children !== null && (
        <DialogTrigger asChild>
            {children || (
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nova Questão
            </Button>
            )}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{question ? "Editar Questão" : "Nova Questão"}</DialogTitle>
          <DialogDescription>
            {question ? "Edite os detalhes da questão abaixo." : "Preencha os detalhes da questão abaixo."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="statement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enunciado*</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Digite o enunciado da questão..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tipo*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="objective">Objetiva</SelectItem>
                        <SelectItem value="discursive">Discursiva</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Matéria*</FormLabel>
                    <FormControl>
                        <Input placeholder="Ex: Direito Constitucional" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
              control={form.control}
              name="correct_answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resposta Correta*</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Digite a resposta correta..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resolução (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Link ou texto da resolução..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Banca</FormLabel>
                    <FormControl>
                        <Input placeholder="Ex: CESPE" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="exam"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Processo</FormLabel>
                    <FormControl>
                        <Input placeholder="Ex: PF Agente" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="Ex: 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tópico</FormLabel>
                    <FormControl>
                        <Input placeholder="Assunto geral" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="subtopic"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Subtópico</FormLabel>
                    <FormControl>
                        <Input placeholder="Cobrança específica" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : (question ? "Salvar Alterações" : "Criar Questão")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
