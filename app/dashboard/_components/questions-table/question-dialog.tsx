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
// import { ImageUpload } from "@/components/ui/image-upload" // Removido
// import { Input } from "@/components/ui/input" // Removido se não usado, mas ainda usamos Input
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { updateQuestion, createQuestion, getCollectionMetadata } from "@/app/dashboard/questions/actions"
import { CreatableCombobox } from "@/components/ui/creatable-combobox"
import { Question } from "./columns"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

const formSchema = z.object({
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
})

const steps = [
  { id: 1, name: "Enunciado", fields: ["statement", "statement_image_url"] },
  { id: 2, name: "Resposta", fields: ["type", "correct_answer", "resolution"] },
  { id: 3, name: "Metadados", fields: ["subject", "institution", "exam", "year", "topic", "subtopic"] },
] as const

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
  // const [imageFile, setImageFile] = useState<File | null>(null) // Removido
  const [currentStep, setCurrentStep] = useState(1)
  const [metadataOptions, setMetadataOptions] = useState({
    subjects: [] as string[],
    institutions: [] as string[],
    exams: [] as string[],
    topics: [] as string[],
    subtopics: [] as string[],
    years: [] as number[],
  })

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = isControlled ? setControlledOpen : setInternalOpen

  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      statement: "",
      statement_image_url: null,
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
      getCollectionMetadata(collectionId).then(data => {
        setMetadataOptions(data)
      })

        // setImageFile(null)
        setCurrentStep(1)
        if (question) {
            form.reset({
                originalData: question,
                statement: question.statement,
                statement_image_url: question.statement_image_url || null,
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
                statement_image_url: null,
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
  }, [open, question, form, collectionId])

  async function uploadImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${collectionId}/${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("question-images")
        .upload(fileName, file)

      if (uploadError) {
        console.error("Upload error:", uploadError)
        return null
      }

      const { data: { publicUrl } } = supabase.storage
        .from("question-images")
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error("Upload failed:", error)
      return null
    }
  }

  async function validateCurrentStep(): Promise<boolean> {
    const currentStepData = steps[currentStep - 1]
    const result = await form.trigger(currentStepData.fields as any)
    return result
  }

  async function handleNext() {
    const isValid = await validateCurrentStep()
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  function handlePrevious() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        // Lógica de upload removida pois agora é inline no RichText
        /*
        let imageUrl = values.statement_image_url

        if (imageFile) {
          const uploadedUrl = await uploadImage(imageFile)
          if (uploadedUrl) {
            imageUrl = uploadedUrl
          }
        }
        */
        const imageUrl = values.statement_image_url // Mantendo valor original se existir

        const submissionData = {
            ...values,
            statement_image_url: imageUrl,
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
        setCurrentStep(1)
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
      <DialogContent className="!w-[95vw] !max-w-7xl h-[70vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>{question ? "Editar Questão" : "Nova Questão"}</DialogTitle>
          <DialogDescription>
            {question ? "Edite os detalhes da questão abaixo." : "Preencha os detalhes da questão abaixo."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Step Indicators - Left Sidebar */}
          <div className="w-56 border-r p-4 flex flex-col gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left w-full",
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : currentStep > step.id
                    ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                    : "text-muted-foreground hover:bg-muted/10"
                )}
              >
                <span className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                  currentStep === step.id
                    ? "bg-primary-foreground text-primary"
                    : currentStep > step.id
                    ? "bg-green-500 text-white"
                    : "bg-muted-foreground/20"
                )}>
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </span>
                {step.name}
              </button>
            ))}
          </div>

          {/* Form Content - Right Side */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6">
              {/* Step 1: Enunciado */}
              {currentStep === 1 && (
                <div className="space-y-6 h-full flex flex-col">
                  <FormField
                    control={form.control}
                    name="statement"
                    render={({ field }) => (
                      <FormItem className="h-full flex flex-col">
                        <FormLabel>Enunciado*</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Digite o enunciado da questão..."
                            collectionId={collectionId}
                            className="flex-1 min-h-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 2: Resposta */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo*</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
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
                    name="correct_answer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resposta Correta*</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Digite a resposta correta..." 
                            className="min-h-[150px] resize-none"
                            {...field} 
                          />
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
                          <Textarea 
                            placeholder="Link ou texto da resolução..." 
                            className="min-h-[100px] resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Metadados */}
              {currentStep === 3 && (
                <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matéria*</FormLabel>
                          <FormControl>
                            <CreatableCombobox 
                                options={metadataOptions.subjects}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Selecione ou digite a matéria"
                            />
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
                              <CreatableCombobox 
                                options={metadataOptions.institutions}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Selecione ou digite a banca"
                              />
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
                              <CreatableCombobox 
                                options={metadataOptions.exams}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Selecione ou digite o processo"
                              />
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
                              <CreatableCombobox 
                                options={metadataOptions.years.map(String)}
                                value={field.value ? String(field.value) : ""}
                                onChange={(val) => field.onChange(val ? Number(val) : undefined)}
                                placeholder="Ano"
                              />
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
                              <CreatableCombobox 
                                options={metadataOptions.topics}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Selecione ou digite o tópico"
                              />
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
                              <CreatableCombobox 
                                options={metadataOptions.subtopics}
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Selecione ou digite o subtópico"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                </div>
              )}
            </div>

            <DialogFooter className="border-t p-4 flex-shrink-0">
              <div className="flex w-full justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>

                {currentStep < steps.length ? (
                  <Button type="button" onClick={handleNext}>
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Salvando..." : (question ? "Salvar Alterações" : "Criar Questão")}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
