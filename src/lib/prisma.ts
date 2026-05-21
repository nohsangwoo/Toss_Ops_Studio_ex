import { PGlite } from "@electric-sql/pglite";
import { PrismaClient } from "@prisma/client";
import { PrismaPGlite } from "pglite-prisma-adapter";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pglite?: PGlite;
};

function getDatabaseDir() {
  return process.env.DATABASE_DIR ?? "./.pglite";
}

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.pglite = new PGlite({ dataDir: getDatabaseDir() });
    const adapter = new PrismaPGlite(globalForPrisma.pglite);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }

  return globalForPrisma.prisma;
}
