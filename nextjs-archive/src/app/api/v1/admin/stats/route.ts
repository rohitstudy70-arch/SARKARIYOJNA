import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';




export async function GET(request: Request) {
  try {
    const [schemes, categories, states] = await Promise.all([
      prisma.scheme.count(),
      prisma.category.count(),
      prisma.state.count(),
    ]);

    // Returning stats counts
    return NextResponse.json({
      schemes,
      categories,
      states,
      jobs: 0,
      results: 0,
      admitCards: 0,
      scholarships: 0,
      news: 0,
      blogs: 0
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
