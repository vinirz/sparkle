"use client"

import { Row, Table } from "@tanstack/react-table"
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
import { Question } from "./columns"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  table: Table<TData>
}

export function QuestionRowActions<TData extends Question>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {
  const question = row.original

  return (
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
          onClick={async () => {
            const toastId = toast.loading("Copiando...")
            try {
                  const html = `
                    <div>
                      <div style="font-size: 14pt; font-family: sans-serif;">${question.statement}</div>
                      ${question.statement_image_url ? `<br/><img src="${question.statement_image_url}" style="max-width: 500px;" /><br/>` : ''}
                    </div>
                  `
                  
                  const text = question.statement.replace(/<[^>]*>?/gm, '')

                  const blobHtml = new Blob([html], { type: "text/html" })
                  const blobText = new Blob([text], { type: "text/plain" })
                  
                  const data = [new ClipboardItem({
                    ["text/html"]: blobHtml,
                    ["text/plain"]: blobText,
                  })]

              await navigator.clipboard.write(data)
              toast.success("Enunciado copiado com sucesso!", { id: toastId })
            } catch (err) {
              console.error(err)
              // Fallback
              navigator.clipboard.writeText(question.statement)
              toast.error("Erro ao copiar formato rico. Texto copiado.", { id: toastId })
            }
          }}
          className="cursor-pointer hover:opacity-80"
        >
          Copiar Enunciado
        </DropdownMenuItem>
        <DropdownMenuItem 
            className="cursor-pointer hover:opacity-80" 
            onSelect={() => (table.options.meta as any)?.onEdit(question)}
        >
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
  )
}
