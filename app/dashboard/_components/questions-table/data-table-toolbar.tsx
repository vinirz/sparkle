"use client"

import { X } from "lucide-react"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrar por enunciado..."
          value={(table.getColumn("statement")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("statement")?.setFilterValue(event.target.value)
          }
           className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Tipo"
            options={[
              { label: "Objetiva", value: "objective" },
              { label: "Discursiva", value: "discursive" },
            ]}
          />
        )}
        {table.getColumn("subject") && (
          <DataTableFacetedFilter
            column={table.getColumn("subject")}
            title="Matéria"
            options={Array.from(table.getColumn("subject")?.getFacetedUniqueValues()?.keys() || []).map(val => ({
                label: String(val),
                value: String(val)
            }))}
          />
        )}
        {table.getColumn("topic") && (
          <DataTableFacetedFilter
            column={table.getColumn("topic")}
            title="Tópico"
            options={Array.from(table.getColumn("topic")?.getFacetedUniqueValues()?.keys() || []).map(val => ({
                label: String(val),
                value: String(val)
            }))}
          />
        )}
        {table.getColumn("institution") && (
          <DataTableFacetedFilter
            column={table.getColumn("institution")}
            title="Banca"
            options={Array.from(table.getColumn("institution")?.getFacetedUniqueValues()?.keys() || []).map(val => ({
                label: String(val),
                value: String(val)
            }))}
          />
        )}
        {table.getColumn("difficulty") && (
          <DataTableFacetedFilter
            column={table.getColumn("difficulty")}
            title="Dificuldade"
            options={[
                { label: "Fácil", value: "Easy" },
                { label: "Médio", value: "Medium" },
                { label: "Difícil", value: "Hard" },
            ]}
          />
        )}
        {table.getColumn("year") && (
          <DataTableFacetedFilter
            column={table.getColumn("year")}
            title="Ano"
            options={Array.from(table.getColumn("year")?.getFacetedUniqueValues()?.keys() || []).sort((a,b) => Number(b)-Number(a)).map(val => ({
                label: String(val),
                value: String(val)
            }))}
          />
        )}
        
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
