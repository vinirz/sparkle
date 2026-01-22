"use client"

import { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteQuestion } from "@/app/dashboard/questions/actions"
import { toast } from "sonner"
import { useState } from "react"
import { QuestionDialog } from "./question-dialog"
import { Question } from "./columns"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function QuestionRowActions<TData extends Question>({
  row,
}: DataTableRowActionsProps<TData>) {
  const question = row.original
  const [showEditDialog, setShowEditDialog] = useState(false)

  return (
    <>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(question.statement)}
              className="cursor-pointer hover:opacity-80"
            >
            Copiar Enunciado
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:opacity-80" onSelect={() => setShowEditDialog(true)}>
                Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => {
                try {
                    await deleteQuestion(question.id, question.collection_id)
                    toast.success("Questão excluída com sucesso.")
                } catch (error) {
                    toast.error("Erro ao excluir questão.")
                }
            }} className="cursor-pointer text-red-600 focus:text-red-600 hover:text-red-600 hover:opacity-80">
                Excluir
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>

        <QuestionDialog 
            open={showEditDialog} 
            onOpenChange={setShowEditDialog} 
            question={question}
            collectionId={question.collection_id} 
            children={null} 
        />
    </>
  )
}
