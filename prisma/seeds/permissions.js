require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../../src/generated/prisma');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const permissions = [
  { resource: "billing", action: "manage" },

  { resource: "coupon", action: "manage" },
  { resource: "coupon", action: "read" },

  { resource: "crm", action: "read" },

  { resource: "examBoard", action: "manage" },
  { resource: "examBoard", action: "read" },

  { resource: "examEdition", action: "manage" },
  { resource: "examEdition", action: "read" },

  { resource: "examPhase", action: "manage" },
  { resource: "examPhase", action: "read" },

  { resource: "expectedAnswer", action: "manage" },
  { resource: "expectedAnswer", action: "read" },

  { resource: "finance", action: "read" },

  { resource: "perm", action: "manage" },
  { resource: "perm", action: "read" },

  { resource: "plan", action: "manage" },
  { resource: "plan", action: "read" },

  { resource: "profile", action: "update" },

  { resource: "question", action: "batch" },
  { resource: "question", action: "create" },
  { resource: "question", action: "delete" },
  { resource: "question", action: "read" },
  { resource: "question", action: "update" },

  { resource: "role", action: "manage" },
  { resource: "role", action: "read" },

  { resource: "rubric", action: "manage" },
  { resource: "rubric", action: "read" },

  { resource: "session", action: "read" },
  { resource: "session", action: "revoke" },

  { resource: "skill", action: "manage" },
  { resource: "skill", action: "read" },

  { resource: "subject", action: "manage" },
  { resource: "subject", action: "read" },

  { resource: "subscription", action: "manage" },
  { resource: "subscription", action: "read" },

  { resource: "user", action: "access.update" },
  { resource: "user", action: "create" },
  { resource: "user", action: "delete" },
  { resource: "user", action: "read" },
  { resource: "user", action: "update" }
];

async function main() {
  console.log("🌱 Iniciando seed de permissões...");

  for (const p of permissions) {
    const key = `${p.resource}.${p.action}`;

    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: {
        resource: p.resource,
        action: p.action,
        key
      }
    });
  }

  console.log("✅ Permissões atualizadas/criadas com sucesso!");
}

main()
  .catch((err) => {
    console.error("❌ Erro no seed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
