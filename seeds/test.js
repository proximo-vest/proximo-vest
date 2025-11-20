// prisma/seeds/permissions.ts (por exemplo)

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const permissions = [
  // ===== EXAMS =====
  { resource: "exam", action: "read" },      // exam.read
  { resource: "exam", action: "create" },    // exam.create
  { resource: "exam", action: "update" },    // exam.update
  { resource: "exam", action: "delete" },    // exam.delete
  { resource: "exam", action: "publish" },   // exam.publish

  // ===== QUESTIONS =====
  { resource: "question", action: "read" },
  { resource: "question", action: "create" },
  { resource: "question", action: "update" },
  { resource: "question", action: "delete" },

  // ===== ROLES =====
  { resource: "role", action: "read" },
  { resource: "role", action: "create" },
  { resource: "role", action: "update" },
  { resource: "role", action: "delete" },
  { resource: "role", action: "managePermissions" }, // role.managePermissions

  // ===== PERMISSIONS =====
  { resource: "permission", action: "read" },
  { resource: "permission", action: "create" },
  { resource: "permission", action: "update" },
  { resource: "permission", action: "delete" },

  // ===== USERS =====
  { resource: "user", action: "read" },
  { resource: "user", action: "update" },
  { resource: "user", action: "manageRoles" }, // user.manageRoles
];

async function main() {
  for (const perm of permissions) {
    const key = `${perm.resource}.${perm.action}`;

    await prisma.permission.upsert({
      where: { key },
      update: {
        // se quiser permitir reativar permissão desativada:
        isActive: true,
      },
      create: {
        resource: perm.resource,
        action: perm.action,
        key,
        isActive: true,
      },
    });

    console.log(`✔ Permissão garantida: ${key}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
