import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';




export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('q') || '';
    const categorySlug = searchParams.get('category');
    const stateSlug = searchParams.get('state');

    const skip = (page - 1) * limit;

    const where: Prisma.SchemeWhereInput = {
      status: 'PUBLISHED',
      ...(search ? {
        OR: [
          { title: { contains: search } },
          { hindiName: { contains: search } },
          { keywords: { contains: search } }
        ]
      } : {}),
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(stateSlug ? { state: { slug: stateSlug } } : {})
    };

    const [schemes, total] = await Promise.all([
      prisma.scheme.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: { category: true, state: true }
      }),
      prisma.scheme.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: schemes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
