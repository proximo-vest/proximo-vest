import { BoardViewClient } from './_components/board-view-client'
import { DataTable } from "./_components/data-table";
import { SectionCards } from "../_components/section-cards";
import { requirePageAuth } from "@/utils/access";

type Board = { id: number; name: string; slug: string };

interface PageProps {
    params: { slug: string };
}

export default async function Provas({ params }: PageProps) {
     await requirePageAuth({
        role: "Admin",          // OU perm: "exam.read"
        emailVerified: true,
        blockSuspended: true,
        blockDeleted: true,
        onForbiddenRedirect: "/dashboard", // opcional
      });

    const { slug } = await params;


    const res = await fetch(`${process.env.API_URL}/exam-board/slug/${slug}`, {
        cache: 'no-store'
    });


    const board = await res.json();

    const resEditions = await fetch(`${process.env.API_URL}/exam-edition/list?examBoardId=${board.id}`, {
        cache: 'no-store'
    });
    const editions = await resEditions.json();
    const editionNumber = editions.length as number;


    return (
        <div className="@container/main flex flex-col gap-4 md:gap-6">
            <h1 className="font-bold text-2xl">Criação da Edição</h1>
            <p>Essa é primeira etapa para começar a criar um prova. Coloque o nome da prova. Exemplo:    <code>Unicamp</code></p>
            <BoardViewClient board={board} />
            <SectionCards editionNumber={editionNumber} />
            <DataTable data={editions} />

        </div>
    );
}
