import { prisma } from "@/lib/prisma";
import { requirePageAuth } from "@/utils/access";
import { UserPermissionsForm } from "./_components/UserPermissionsForm";

export default async function UserPermissionsPage({
  params,
}: {
  params: { userId: string };
}) {
  await requirePageAuth({
    role: "Admin",
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
    onForbiddenRedirect: "/dashboard",
  });
  const { userId } = await params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return <div className="p-4">Usuário não encontrado.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">
          Permissões diretas de {user.email}
        </h1>
        <p className="text-xs text-muted-foreground">
          Essas permissões são aplicadas diretamente ao usuário, além das
          permissões herdadas pelas roles.
        </p>
      </div>

      <UserPermissionsForm userId={userId} />
    </div>
  );
}
