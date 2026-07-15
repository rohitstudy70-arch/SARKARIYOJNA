import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';




async function getScheme(slug: string) {
  const scheme = await prisma.scheme.findUnique({
    where: { slug },
    include: { category: true, state: true }
  });
  if (!scheme) return null;
  return { data: scheme };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const schemeData = await getScheme(params.slug);
  if (!schemeData?.data) return { title: 'Not Found' };
  
  const scheme = schemeData.data;
  return {
    title: scheme.seoTitle || `${scheme.title} - Apply Online, Eligibility, Benefits`,
    description: scheme.seoDesc || scheme.shortDesc,
    keywords: scheme.keywords,
  };
}

export default async function SchemeDetailPage({ params }: { params: { slug: string } }) {
  const schemeData = await getScheme(params.slug);
  
  if (!schemeData?.data) {
    notFound();
  }

  const scheme = schemeData.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold hover:underline">&larr; Back to Home</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100 bg-gray-50/50">
            <div className="flex flex-wrap gap-2 mb-4">
              {scheme.category && (
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                  {scheme.category.name}
                </span>
              )}
              {scheme.state && (
                <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">
                  {scheme.state.name}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{scheme.title}</h1>
            {scheme.hindiName && <h2 className="text-xl text-gray-600 mb-4">{scheme.hindiName}</h2>}
            <p className="text-lg text-gray-700 font-medium">{scheme.shortDesc}</p>
          </div>

          <div className="p-8 prose prose-blue max-w-none">
            {scheme.content ? (
              <div dangerouslySetInnerHTML={{ __html: scheme.content }} />
            ) : (
              <p className="text-gray-500 italic">Detailed content is being updated...</p>
            )}
            
            {scheme.officialLinks && (
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="text-xl font-bold text-blue-900 mb-4">Official Resources</h3>
                <a href={scheme.officialLinks} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm">
                  Visit Official Website
                </a>
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
