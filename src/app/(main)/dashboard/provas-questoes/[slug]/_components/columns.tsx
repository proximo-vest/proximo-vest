import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { DataTableColumnHeader } from "../../../../../../components/data-table/data-table-column-header";

import { sectionSchema } from "./schema";

type Section = z.infer<typeof sectionSchema>;

export function getDashboardColumns(slug: string): ColumnDef<Section>[] {
  return [
    {
      accessorKey: "year",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome da Prova" />
      ),
      cell: ({ row }) => {
        return (
          <a
            className="underline-offset-2 hover:underline"
            href={`/dashboard/provas-questoes/${slug}/${row.original.id}`}
          >
            <Label htmlFor={`${row.original.year}-name`}>
              {row.original.year}
            </Label>
          </a>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "editionLabel",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Edição" />
      ),
      cell: ({ row }) => (
        <div className="w-32">
          <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.original.editionLabel}
          </Badge>
        </div>
      ),
      enableSorting: false,
    },
    {
      id: "actions",
      header: () => <div className="text-right pr-4">Ações</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2 pr-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <EllipsisVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={() =>
                  console.log("Editar", slug, row.original.id)
                }
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      enableSorting: false,
    },
  ];
}
