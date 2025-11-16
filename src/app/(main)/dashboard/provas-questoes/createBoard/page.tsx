import { FormCreateBoard } from "./_components/formCreateBoard";
import { requirePageAuth } from "@/utils/access";

export default async function Provas() {
  await requirePageAuth({
    role: "Admin", // OU perm: "exam.read"
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
    onForbiddenRedirect: "/dashboard", // opcional
  });

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <h1 className="font-bold text-2xl">Criar Prova</h1>
      <p>
        Essa é primeira etapa para começar a criar um prova. Coloque o nome da
        prova. Exemplo: <code>Unicamp</code>
      </p>
      <FormCreateBoard />
    </div>
  );
}
