import { ListBuilder } from "./_components/list-builder";
import { requirePageAuth } from "@/utils/access";

export default async function TeacherListsPage() {
  await requirePageAuth({
    emailVerified: true,
    blockDeleted: true,
    blockSuspended: true,
  });

  return (
    <div className="@container/main flex flex-col gap-6">
      <ListBuilder />
    </div>
  );
}
