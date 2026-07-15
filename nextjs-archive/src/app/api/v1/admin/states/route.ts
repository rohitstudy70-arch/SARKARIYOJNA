import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const states = await prisma.state.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(states);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
