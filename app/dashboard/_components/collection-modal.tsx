'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCollection } from "../actions"
import { toast } from "sonner"

export default function CollectionModal({ children }: {children: ReactNode}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function onSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await createCollection(formData)
        setOpen(false)
        toast.success("Coleção criada com sucesso!")
      } catch (error) {
        toast.error("Erro ao criar coleção")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Nova coleção
          </DialogTitle>
          <DialogDescription>
            Crie uma coleção para organizar suas questões.
          </DialogDescription>
        </DialogHeader>
        
        <form action={onSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da coleção</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Ex: Direito Constitucional" 
              required 
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Criando..." : "Criar Coleção"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}