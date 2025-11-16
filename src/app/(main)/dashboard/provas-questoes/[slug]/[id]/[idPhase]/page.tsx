import { BoardViewClient } from "./_components/board-view-client";
import { DataTable } from "./_components/data-table";
import { SectionCards } from "./_components/section-cards";
import { requirePageAuth } from "@/utils/access";
interface PageProps {
  params: { slug: string; id: string, idPhase: string };
}

export default async function Provas({ params }: PageProps) {
  await requirePageAuth({
    role: "Admin", // OU perm: "exam.read"
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
    onForbiddenRedirect: "/dashboard", // opcional
  });

  const { slug, id, idPhase } = await params;

  const res = await fetch(`${process.env.API_URL}/exam-phase/${idPhase}`, {
    cache: "no-store",
  });

  const phase = await res.json();


  const resQuestions = await fetch(
    `${process.env.API_URL}/question/list?examPhaseId=${phase.id}`,
    {
      cache: "no-store",
    }
  );
  const questions = await resQuestions.json();
  const questionsNumber = questions.length as number;

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <BoardViewClient board={phase} />
      <SectionCards phasesNumber={questionsNumber} />
      <h1 className="font-bold text-2xl">Fases</h1>
      <p>
        Aqui você criará as fases (1° e 2° fase) ou os dias (D1 e D2) de uma edição de prova de um determinado ano</p>
      <DataTable data={questions} slug={slug} id={id} />
    </div>
  );
}
