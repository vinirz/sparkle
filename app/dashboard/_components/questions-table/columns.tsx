"use client"

import { ColumnDef } from "@tanstack/react-table"
import { QuestionRowActions } from "./question-row-actions"
import { DataTableColumnHeader } from "./data-table-column-header"

export type Question = {
  id: string
  statement: string
  statement_image_url: string | null
  type: "objective" | "discursive"
  correct_answer: string
  resolution: string | null
  subject: string
  institution: string | null
  exam: string | null
  year: number | null
  topic: string | null
  subtopic: string | null
  difficulty: string | null
  collection_id: string
  created_at: string
}

export const columns: ColumnDef<Question>[] = [
  {
    accessorKey: "statement",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enunciado" />
    ),
    cell: ({ row }) => {
      const statement = row.getValue("statement") as string
      const plainText = statement.replace(/<[^>]*>?/gm, '')
      return <div className="max-w-[400px] truncate font-medium" title={plainText}>{plainText}</div>
    },
    enableSorting: false, 
    enableHiding: false, 
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return (
        <div className="flex w-[100px] items-center">
             <span className="capitalize">{type === 'objective' ? 'Objetiva' : 'Discursiva'}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Matéria" />
    ),
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "topic",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tópico" />
    ),
    cell: ({ row }) => {
        const topic = row.getValue("topic") as string
        return <div className="truncate" title={topic}>{topic || "-"}</div>
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "institution",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Banca" />
    ),
    cell: ({ row }) => {
        return <div className="truncate">{row.getValue("institution") || "-"}</div>
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
    },
  },
  {
      accessorKey: "year",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ano" />
      ),
      cell: ({ row }) => {
          return <div>{row.getValue("year") || "-"}</div>
      },
      filterFn: (row, id, value) => {
        // Handle number filtering if value is string array
        return value.includes(String(row.getValue(id)))
      },
  },
  {
      accessorKey: "exam",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Prova" />
      ),
      cell: ({ row }) => {
          return <div className="truncate" title={row.getValue("exam") as string}>{row.getValue("exam") || "-"}</div>
      },
  },
  {
    accessorKey: "difficulty",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dificuldade" />
    ),
    cell: ({ row }) => {
      const difficulty = row.getValue("difficulty") as string
      if (!difficulty) return <div className="text-muted-foreground">-</div>
      
      const label = difficulty === "Easy" ? "Fácil" : difficulty === "Medium" ? "Médio" : "Difícil"
      const color = difficulty === "Easy" ? "bg-green-600 dark:bg-green-400" : difficulty === "Medium" ? "bg-yellow-600 dark:bg-yellow-400" : "bg-red-600 dark:bg-red-400"
      
      return (
        <div className="flex items-center gap-2">
          <div className='font-medium'>{label}</div>
          <div className={`w-2 h-2 rounded-full ${color}`}></div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => <QuestionRowActions row={row} table={table} />,
  },
]
