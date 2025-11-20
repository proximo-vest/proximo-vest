import { CreateRoleForm } from "./_components/CreateRoleForm";

import { requirePageAuth } from "@/utils/access";

import { Label } from "@/components/ui/label";

export default async function Page() {
  await requirePageAuth({
    role: "Admin", // OU perm: "exam.read"
    emailVerified: true,
    blockSuspended: true,
    blockDeleted: true,
    onForbiddenRedirect: "/dashboard", // opcional
  });

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <Label>Criar Nova Role</Label>
      <CreateRoleForm />
    </div>
  );
}
/*
 */
