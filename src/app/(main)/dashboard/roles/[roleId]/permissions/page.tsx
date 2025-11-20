// app/(dashboard)/roles/[roleId]/permissions/page.tsx
import { requirePageAuth } from "@/utils/access";
import { RolePermissionsForm } from "./_components/RolePermissionsForm";
import { prisma } from "@/lib/prisma";

export default async function RolePermissionsPage({
  params,
}: {
  params: { roleId: string };
}) {
  await requirePageAuth({
    role: "Admin",
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
    onForbiddenRedirect: "/dashboard",
  });
const {roleId} = await params
  const role = await prisma.role.findUnique({
    where: { id: roleId },
  });

  if (!role) {
    return <div className="p-4">Role não encontrada.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">
          Permissões da role: {role.name}
        </h1>
        {role.description && (
          <p className="text-sm text-muted-foreground">{role.description}</p>
        )}
      </div>

      <RolePermissionsForm roleId={role.id} />
    </div>
  );
}
