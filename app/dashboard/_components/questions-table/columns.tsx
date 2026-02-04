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
      return <div className="max-w-[400px] truncate font-medium" title={statement}>{statement}</div>
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
    id: "actions",
    cell: ({ row, table }) => <QuestionRowActions row={row} table={table} />,
  },
]
