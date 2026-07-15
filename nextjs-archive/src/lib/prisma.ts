import { PrismaClient } from '@prisma/client';

import fs from 'fs';
import path from 'path';
import os from 'os';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Hostinger's public directory might be read-only or have permission issues that prevent SQLite from opening.
// Copy the database to the OS temp directory at runtime to guarantee read/write access.
const sourceDbPath = path.join(process.cwd(), 'public', 'dev.db');
const tempDbPath = path.join(os.tmpdir(), 'dev.db');

try {
  // Always copy it if it doesn't exist in tmp, or if we want to ensure it's up to date.
  // For production, if we want persistence, we shouldn't overwrite it if it exists.
  if (!fs.existsSync(tempDbPath) && fs.existsSync(sourceDbPath)) {
    fs.copyFileSync(sourceDbPath, tempDbPath);
  }
} catch (e) {
  console.error("Failed to copy database to temp directory:", e);
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
    datasources: {
      db: {
        url: `file:${tempDbPath}`
      }
    }
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
