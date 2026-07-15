import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single scheme by ID
    if (id) {
      const scheme = await prisma.scheme.findUnique({
        where: { id },
        include: { category: true, state: true }
      });
      if (!scheme) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(scheme);
    }

    // All schemes list
    const schemes = await prisma.scheme.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { category: true, state: true }
    });
    return NextResponse.json(schemes);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title, slug, shortDesc, content, categoryId, stateId, status,
      hindiName, officialLinks, images, eligibility, benefits, documents,
      applicationProcess, seoTitle, seoDesc, keywords,
      featured, trending, popular, priorityOrder
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: 'Title aur Slug required hai' }, { status: 400 });
    }

    const newScheme = await prisma.scheme.create({
      data: {
        title,
        slug,
        shortDesc: shortDesc || null,
        content: content || null,
        categoryId: categoryId || null,
        stateId: stateId || null,
        status: status || 'PUBLISHED',
        hindiName: hindiName || null,
        officialLinks: officialLinks || null,
        images: images || null,
        eligibility: eligibility || null,
        benefits: benefits || null,
        documents: documents || null,
        applicationProcess: applicationProcess || null,
        seoTitle: seoTitle || null,
        seoDesc: seoDesc || null,
        keywords: keywords || null,
        featured: featured || false,
        trending: trending || false,
        popular: popular || false,
        priorityOrder: priorityOrder || 0,
      }
    });
    return NextResponse.json({ success: true, data: newScheme });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id, title, slug, shortDesc, content, categoryId, stateId, status,
      hindiName, officialLinks, images, eligibility, benefits, documents,
      applicationProcess, seoTitle, seoDesc, keywords,
      featured, trending, popular, priorityOrder
    } = body;

    if (!id) return NextResponse.json({ success: false, error: 'ID required hai' }, { status: 400 });

    const updatedScheme = await prisma.scheme.update({
      where: { id },
      data: {
        title,
        slug,
        shortDesc: shortDesc || null,
        content: content || null,
        categoryId: categoryId || null,
        stateId: stateId || null,
        status,
        hindiName: hindiName || null,
        officialLinks: officialLinks || null,
        images: images || null,
        eligibility: eligibility || null,
        benefits: benefits || null,
        documents: documents || null,
        applicationProcess: applicationProcess || null,
        seoTitle: seoTitle || null,
        seoDesc: seoDesc || null,
        keywords: keywords || null,
        featured: featured ?? false,
        trending: trending ?? false,
        popular: popular ?? false,
        priorityOrder: priorityOrder ?? 0,
      }
    });
    return NextResponse.json({ success: true, data: updatedScheme });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, message: 'ID required hai' }, { status: 400 });

    await prisma.scheme.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Yojana delete ho gayi' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
