import { prisma } from "@/lib/prisma";
import { requirePageAuth } from "@/utils/access";
import { UserRolesForm } from "./_components/UserRolesForm";

export default async function UserRolesPage({
  params,
}: {
  params: { userId: string };
}) {
    const {userId} = await params
  await requirePageAuth({
    role: "Admin",
    emailVerified: true,
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return <div className="p-4">Usuário não encontrado.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Roles de {user.email}</h1>
      <UserRolesForm userId={userId} />
    </div>
  );
}
