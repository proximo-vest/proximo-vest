import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { DataTable } from "./_components/data-table";
import data from "./_components/data.json";
import { SectionCards } from "./_components/section-cards";
import { requirePageAuth } from "@/utils/access";

export default async function Page() {
  await requirePageAuth({
    //perm: "user.read",          // OU perm: "exam.read"
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
    onForbiddenRedirect: "/dashboard", // opcional
  });

  const res = await fetch(`${process.env.API_URL}/users/list`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("ERRO /api/users/list:", res.status, text);
    // em vez de estourar um erro genérico, mostra algo mais amigável
    throw new Error(`Falha ao buscar usuários: ${res.status}`);
  }

  const boards = await res.json();
  const boardNumber = boards.length as number;

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <SectionCards userNumber={boardNumber} />

      <DataTable data={boards} />
    </div>
  );
}
