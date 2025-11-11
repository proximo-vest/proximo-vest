import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Permissões base
  const perms = [
    { resource: "exam", action: "publish" },
    { resource: "exam", action: "delete"  },
    { resource: "exam", action: "read"    },
    { resource: "user", action: "create"  },
    { resource: "user", action: "delete"  },
  ];

  const permRecords = await Promise.all(
    perms.map(p =>
      prisma.permission.upsert({
        where: { key: `${p.resource}.${p.action}` },
        update: {},
        create: { ...p, key: `${p.resource}.${p.action}` },
      })
    )
  );

  // Roles
  const admin = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin", description: "Acesso total" },
  });
  const editor = await prisma.role.upsert({
    where: { name: "editor" },
    update: {},
    create: { name: "editor", description: "Publica provas" },
  });

  // Vincula permissões
  await prisma.rolePermission.createMany({
    data: permRecords.map(p => ({ roleId: admin.id, permissionId: p.id })),
    skipDuplicates: true,
  });

  const publish = permRecords.find(p => p.key === "exam.publish")!;
  const read    = permRecords.find(p => p.key === "exam.read")!;

  await prisma.rolePermission.createMany({
    data: [
      { roleId: editor.id, permissionId: publish.id },
      { roleId: editor.id, permissionId: read.id },
    ],
    skipDuplicates: true,
  });

  console.log("Seed OK");
}

main().finally(() => prisma.$disconnect());
