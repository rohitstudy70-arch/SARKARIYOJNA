import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import Link from 'next/link';

import { PrismaClient, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';




async function getCategorySchemes(slug: string, pageStr: string = '1') {
  const page = parseInt(pageStr);
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Prisma.SchemeWhereInput = {
    status: 'PUBLISHED',
    category: { slug }
  };

  const [schemes, total] = await Promise.all([
    prisma.scheme.findMany({
      where, skip, take: limit, orderBy: { updatedAt: 'desc' }, include: { state: true }
    }),
    prisma.scheme.count({ where })
  ]);
  
  return { data: schemes, pagination: { total, totalPages: Math.ceil(total / limit) } };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const formattedTitle = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${formattedTitle} Schemes | All Sarkari Yojana`,
    description: `Latest government schemes and updates for ${formattedTitle}.`,
  };
}

export default async function CategoryPage({ params, searchParams }: { params: { slug: string }, searchParams: { page?: string } }) {
  const currentPage = searchParams.page || '1';
  const { data: schemes, pagination } = await getCategorySchemes(params.slug, currentPage);
  const formattedTitle = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <Link href="/" className="text-xl font-bold hover:underline">&larr; Home</Link>
          <span className="font-semibold text-lg">{formattedTitle} Schemes</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <span className="bg-blue-600 w-2 h-8 rounded-full"></span>
          {formattedTitle} Schemes ({pagination.total})
        </h1>

        {schemes.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            No schemes found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {schemes.map((scheme: any) => (
              <Link key={scheme.id} href={`/yojana/${scheme.slug}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                <div className="p-6">
                  <div className="text-xs font-semibold text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full mb-3">
                    {scheme.state?.name || 'Central Scheme'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">{scheme.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{scheme.shortDesc}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <Link key={page} href={`/category/${params.slug}?page=${page}`} className={`px-4 py-2 rounded-lg font-medium ${page === parseInt(currentPage) ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}>
                {page}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
