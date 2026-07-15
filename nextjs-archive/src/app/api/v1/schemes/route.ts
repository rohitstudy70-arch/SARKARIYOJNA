import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const schemes = await prisma.scheme.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        hindiName: true,
        shortDesc: true,
        slug: true,
        createdAt: true,
        // Content is omitted to reduce payload size on list API
      }
    });
    return NextResponse.json(schemes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch public schemes' }, { status: 500 });
  }
}
