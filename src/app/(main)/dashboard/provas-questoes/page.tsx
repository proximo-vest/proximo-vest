import { DataTable } from "./_components/data-table";
import { SectionCards } from "./_components/section-cards";
import { requirePageAuth } from "@/utils/access";

export default async function Provas() {
  await requirePageAuth({
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
    onForbiddenRedirect: "/dashboard", // opcional
  });
  const res = await fetch(`${process.env.API_URL}/exam-board/list`, {});

  if (!res.ok) throw new Error("Falha ao buscar boards");

  const boards = await res.json();
  const boardNumber = boards.length as number;

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards editionNumber={boardNumber} />
      <DataTable data={boards} />
    </div>
  );
}
