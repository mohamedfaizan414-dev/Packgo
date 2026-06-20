'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import PlanCard from '@/components/home/PlanCard';
import CategoryFilter from '@/components/home/CategoryFilter';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Plan { _id: string; title: string; slug: string; shortDescription: string; destination: string; coverImage: string; price: number; discountedPrice?: number; duration: { days: number; nights: number }; category: string; rating: number; reviewCount: number; isTrending: boolean; difficulty: string; maxGroupSize: number; }

export default function PackagesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (search) params.set('search', search);
    if (searchParams.get('trending') === 'true') params.set('trending', 'true');
    params.set('sortBy', sortBy);
    params.set('page', String(page));
    params.set('limit', '9');
    try {
      const res = await fetch(`/api/plans?${params}`);
      const data = await res.json();
      setPlans(data.plans || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch { setPlans([]); } finally { setLoading(false); }
  }, [category, search, sortBy, page, searchParams]);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchPlans(); };

  return (
    <MainLayout>
      <div className="pt-20 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-hero-gradient py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              Explore Our Packages
            </motion.h1>
            <p className="text-white/70">Handcrafted trips to India's most incredible destinations</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Filters */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-4 py-2.5 flex-1 shadow-sm">
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destinations or trip names..." className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700" />
                {search && <button type="button" onClick={() => { setSearch(''); setPage(1); }}><X className="w-4 h-4 text-gray-400" /></button>}
              </form>
              <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-4 py-2.5 shadow-sm">
                <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-transparent text-sm focus:outline-none text-gray-700">
                  <option value="createdAt">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
            <CategoryFilter active={category} onChange={cat => { setCategory(cat); setPage(1); }} />
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="font-display font-semibold text-xl text-brand-navy mb-2">No packages found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan, i) => <PlanCard key={plan._id} plan={plan} index={i} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${p === page ? 'bg-brand-blue text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-blue'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
