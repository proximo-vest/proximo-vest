import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Loader, EllipsisVertical } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Badge} from '@/components/ui/badge'
import { Label } from "@/components/ui/label";


import { DataTableColumnHeader } from "../../../../../../../components/data-table/data-table-column-header";
import { toast } from "sonner";
import { sectionSchema } from "./schema";
import { TableCellViewer } from "./table-cell-viewer";


export const dashboardColumns: ColumnDef<z.infer<typeof sectionSchema>>[] = [

 {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome da Prova" />
    ),
    cell: ({ row }) => {
      return (
        <a
          className="underline-offset-2 hover:underline"
          href={`/dashboard/provas-questoes/${row.original.year}`}
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Edição" />,
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
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" size="icon">
            <EllipsisVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => console.log("Editar")}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />


        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
  },
];
