"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, ArrowLeft, ArrowRight } from "lucide-react";

export type TransferItem = {
  id: string;
  label: string;        // ex: "exam.read"
  groupLabel?: string;  // ex: "exam"
};

type Props = {
  titleLeft: string;
  titleRight: string;
  items: TransferItem[];
  value: string[]; // ids à direita
  onChange: (nextIds: string[]) => void | Promise<void>;
  loading?: boolean;
};

export function TransferList({
  titleLeft,
  titleRight,
  items,
  value,
  onChange,
  loading,
}: Props) {
  const [leftSearch, setLeftSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  const rightSet = useMemo(() => new Set(value), [value]);

  const leftItems = useMemo(
    () => items.filter((i) => !rightSet.has(i.id)),
    [items, rightSet]
  );
  const rightItems = useMemo(
    () => items.filter((i) => rightSet.has(i.id)),
    [items, rightSet]
  );

  const filteredLeft = leftItems.filter((i) =>
    i.label.toLowerCase().includes(leftSearch.toLowerCase())
  );
  const filteredRight = rightItems.filter((i) =>
    i.label.toLowerCase().includes(rightSearch.toLowerCase())
  );

  function groupByResource(list: TransferItem[]) {
    const groups: Record<string, TransferItem[]> = {};
    for (const item of list) {
      const key = item.groupLabel ?? "Outros";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }

    // ordena grupos e itens dentro do grupo
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([group, items]) => ({
        group,
        items: items.sort((a, b) => a.label.localeCompare(b.label)),
      }));
  }

  const groupedLeft = useMemo(
    () => groupByResource(filteredLeft),
    [filteredLeft]
  );
  const groupedRight = useMemo(
    () => groupByResource(filteredRight),
    [filteredRight]
  );

  function moveLeftToRight() {
    if (!selectedLeft) return;
    if (value.includes(selectedLeft)) return;
    const next = [...value, selectedLeft];
    onChange(next);
    setSelectedLeft(null);
  }

  function moveRightToLeft() {
    if (!selectedRight) return;
    const next = value.filter((id) => id !== selectedRight);
    onChange(next);
    setSelectedRight(null);
  }

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
      {/* COLUNA ESQUERDA */}
      <div className="border rounded-lg flex flex-col h-80">
        <div className="border-b px-3 py-2">
          <Input
            placeholder="Buscar"
            value={leftSearch}
            onChange={(e) => setLeftSearch(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase">
          {titleLeft}
        </div>
        <div className="flex-1 overflow-auto text-sm">
          {groupedLeft.map(({ group, items }) => (
            <div key={group}>
              {/* cabeçalho do bloquinho (ex: EXAM) */}
              <div className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase bg-muted/60">
                {group}
              </div>
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setSelectedLeft((prev) =>
                      prev === item.id ? null : item.id
                    )
                  }
                  className={`w-full text-left px-3 py-2 text-xs border-b hover:bg-muted ${
                    selectedLeft === item.id ? "bg-muted" : ""
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
          {groupedLeft.length === 0 && (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              Nenhum item disponível.
            </div>
          )}
        </div>
      </div>

      {/* BOTÕES CENTRAIS */}
      <div className="flex flex-col items-center justify-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={moveLeftToRight}
          disabled={!selectedLeft || loading}
          title="Adicionar"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={moveRightToLeft}
          disabled={!selectedRight || loading}
          title="Remover"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* COLUNA DIREITA */}
      <div className="border rounded-lg flex flex-col h-80">
        <div className="border-b px-3 py-2">
          <Input
            placeholder="Buscar"
            value={rightSearch}
            onChange={(e) => setRightSearch(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase">
          {titleRight}
        </div>
        <div className="flex-1 overflow-auto text-sm">
          {groupedRight.map(({ group, items }) => (
            <div key={group}>
              <div className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase bg-muted/60">
                {group}
              </div>
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setSelectedRight((prev) =>
                      prev === item.id ? null : item.id
                    )
                  }
                  className={`w-full text-left px-3 py-2 text-xs border-b hover:bg-muted ${
                    selectedRight === item.id ? "bg-muted" : ""
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
          {groupedRight.length === 0 && (
            <div className="px-3 py-2 text-xs text-muted-foreground">
              Nenhum item selecionado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
