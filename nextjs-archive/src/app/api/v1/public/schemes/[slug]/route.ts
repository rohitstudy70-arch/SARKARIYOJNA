import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';




export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;

    const scheme = await prisma.scheme.findUnique({
      where: { slug },
      include: { category: true, state: true }
    });

    if (!scheme) {
      return NextResponse.json({ success: false, message: 'Scheme not found' }, { status: 404 });
    }

    // Increment views asynchronously
    prisma.scheme.update({
      where: { id: scheme.id },
      data: { views: { increment: 1 } }
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      data: scheme
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
