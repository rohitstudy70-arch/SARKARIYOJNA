import Link from 'next/link';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';




async function getHomeData() {
  const [banners, featured, trending, popular, categories, states] = await Promise.all([
    prisma.banner.findMany({ where: { status: 'PUBLISHED' }, orderBy: { priority: 'desc' } }),
    prisma.scheme.findMany({ where: { status: 'PUBLISHED', featured: true }, take: 10, include: { category: true } }),
    prisma.scheme.findMany({ where: { status: 'PUBLISHED', trending: true }, take: 10, include: { category: true } }),
    prisma.scheme.findMany({ where: { status: 'PUBLISHED', popular: true }, take: 10, include: { category: true } }),
    prisma.category.findMany({ take: 12 }),
    prisma.state.findMany({ take: 12 })
  ]);
  return { data: { banners, featured, trending, popular, categories, states } };
}

export default async function HomePage() {
  const { data } = await getHomeData();
  const { banners, featured, trending, popular, categories, states } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">All Sarkari Yojana</Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="hover:text-blue-200">Home</Link>
            <Link href="/categories" className="hover:text-blue-200">Categories</Link>
            <Link href="/states" className="hover:text-blue-200">States</Link>
            <Link href="/search" className="hover:text-blue-200">Search</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Banner Section */}
        {banners && banners.length > 0 && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-lg relative h-[300px] md:h-[400px]">
            <img src={banners[0].imageUrl} alt={banners[0].title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{banners[0].title}</h2>
                {banners[0].link && (
                  <Link href={banners[0].link} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition">View Details</Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Categories Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="bg-blue-600 w-2 h-8 rounded-full"></span>
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat: any) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition text-center border border-gray-100 hover:border-blue-300">
                <div className="w-12 h-12 bg-blue-50 rounded-full mx-auto mb-3 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {cat.name.charAt(0)}
                </div>
                <h3 className="font-medium text-gray-700">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Schemes Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="bg-green-500 w-2 h-8 rounded-full"></span>
            Featured Schemes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((scheme: any) => (
              <Link key={scheme.id} href={`/yojana/${scheme.slug}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                <div className="p-6">
                  <div className="text-xs font-semibold text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded-full mb-3">
                    {scheme.category?.name || 'Government'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">{scheme.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{scheme.shortDesc}</p>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-sm font-medium text-gray-500">
                  <span>Read more</span>
                  <span>&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Schemes Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="bg-orange-500 w-2 h-8 rounded-full"></span>
            Trending Right Now
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((scheme: any) => (
              <Link key={scheme.id} href={`/yojana/${scheme.slug}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition">{scheme.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{scheme.shortDesc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 text-center">
        <p>&copy; {new Date().getFullYear()} All Sarkari Yojana. All rights reserved.</p>
        <p className="text-sm mt-2 text-gray-500">This is an informational portal and not an official government website.</p>
      </footer>
    </div>
  );
}
