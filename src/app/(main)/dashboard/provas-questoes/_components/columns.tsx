import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Loader, EllipsisVertical } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { DataTableColumnHeader } from "../../../../../components/data-table/data-table-column-header";
import { toast } from "sonner";
import { sectionSchema } from "./schema";
import { TableCellViewer } from "./table-cell-viewer";
import React from "react";

async function handleDelete(itemId: number) {
  try {
    const res = await fetch(`/api/exam-board/${itemId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Erro ao deletar o item");

    toast.success("Item deletado com sucesso!");
    // Opcional: atualizar página ou tabela
    window.location.reload();
  } catch (err) {
    console.error(err);
    toast.error("Falha ao deletar o item");
  }
}

async function handleEdit(id: number, data: { name: any }) {
  try {
    const res = await fetch(`/api/exam-board/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      console.log(await res.text());
      throw new Error("Erro ao salvar edição");
    }
    toast.success("Item editado com sucesso!");
    window.location.reload();
  } catch (err) {
    console.error(err);
    toast.error("Erro ao salvar a edição");
  }
}

export const dashboardColumns: ColumnDef<z.infer<typeof sectionSchema>>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome da Prova" />
    ),
    cell: ({ row }) => {
      return (
        <a
          className="underline-offset-2 hover:underline"
          href={`/dashboard/provas-questoes/${row.original.slug}`}
        >
          <Label htmlFor={`${row.original.slug}-name`}>
            {row.original.name}
          </Label>
        </a>
      );
    },
    enableSorting: false,
  },

  {
    accessorKey: "actions",
header: () => (
  <div className="text-right pr-4">
    Ações
  </div>
),

    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = React.useState(false);
      const [isEditOpen, setIsEditOpen] = React.useState(false);

      // dados atuais
      const item = row.original;

      return (
    <div className="flex justify-end items-center gap-2 pr-4">
          {/* Botão que abre o modal de edição */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}
          >
            Editar
          </Button>

          {/* Modal de edição */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Prova</DialogTitle>
                <DialogDescription>
                  Faça alterações nos dados da prova e salve quando terminar.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const formData = new FormData(e.currentTarget);

                  await handleEdit(item.id, {
                    name: formData.get("name"),
                  });

                  setIsEditOpen(false);
                }}
                className="space-y-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Nome</label>
                  <input
                    name="name"
                    defaultValue={item.name}
                    className="border rounded-md px-2 py-1"
                    required
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Salvar alterações
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Botão de deletar */}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
          >
            Deletar
          </Button>

          {/* Modal de confirmação de delete */}
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja deletar esta prova?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso irá deletar
                  permanentemente a prova.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>

                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  onClick={async () => {
                    await handleDelete(item.id);
                    setIsDialogOpen(false);
                  }}
                >
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
    enableSorting: false,
  },
];
