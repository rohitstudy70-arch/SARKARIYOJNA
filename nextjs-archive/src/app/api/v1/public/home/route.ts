import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';




export async function GET() {
  try {
    const [banners, featured, trending, popular, categories, states] = await Promise.all([
      prisma.banner.findMany({ where: { status: 'PUBLISHED' }, orderBy: { priority: 'desc' } }),
      prisma.scheme.findMany({ where: { status: 'PUBLISHED', featured: true }, take: 10, include: { category: true } }),
      prisma.scheme.findMany({ where: { status: 'PUBLISHED', trending: true }, take: 10, include: { category: true } }),
      prisma.scheme.findMany({ where: { status: 'PUBLISHED', popular: true }, take: 10, include: { category: true } }),
      prisma.category.findMany({ take: 12 }),
      prisma.state.findMany({ take: 12 })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        banners,
        featured,
        trending,
        popular,
        categories,
        states
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
