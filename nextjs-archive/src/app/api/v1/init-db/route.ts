import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cwd = process.cwd();
  const dbPath = path.join(cwd, 'public', 'dev.db');
  const dbExists = fs.existsSync(dbPath);
  
  let canRead = false;
  let canWrite = false;
  let canWriteDir = false;
  try {
    if (dbExists) {
      fs.accessSync(dbPath, fs.constants.R_OK);
      canRead = true;
      fs.accessSync(dbPath, fs.constants.W_OK);
      canWrite = true;
    }
    fs.accessSync(path.join(cwd, 'public'), fs.constants.W_OK);
    canWriteDir = true;
  } catch(e) {}

  return NextResponse.json({
    cwd,
    dbPath,
    dbExists,
    canRead,
    canWrite,
    canWriteDir,
    envDatabaseUrl: process.env.DATABASE_URL
  });
}
