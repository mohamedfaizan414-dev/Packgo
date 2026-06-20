'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, MessageSquare, TrendingUp, Star, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';

interface Stats { totalPlans: number; activePlans: number; totalUsers: number; totalEnquiries: number; newEnquiries: number; }
interface DashData { stats: Stats; trendingPlans: { title: string; bookingCount: number; rating: number }[]; recentEnquiries: { _id: string; planTitle: string; userName: string; userPhone: string; status: string; createdAt: string }[]; categoryStats: { _id: string; count: number; avgPrice: number }[]; }

export default function AdminDashboard() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/stats', {
          credentials: 'include'
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const result = await res.json();
        console.log('Dashboard API:', result);

        setData({
          stats: result?.stats || { totalPlans: 0, activePlans: 0, totalUsers: 0, totalEnquiries: 0, newEnquiries: 0 },
          trendingPlans: result?.trendingPlans || [],
          recentEnquiries: result?.recentEnquiries || [],
          categoryStats: result?.categoryStats || []
        });
      } catch (error) {
        console.error('Dashboard fetch failed:', error);
        setData({
          stats: { totalPlans: 0, activePlans: 0, totalUsers: 0, totalEnquiries: 0, newEnquiries: 0 },
          trendingPlans: [], recentEnquiries: [], categoryStats: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />)}
    </div>
  );

  const statCards = [
    // ✅ CHANGED: Displaying activePlans as the large bold integer and tracking total documents in subtext
    { 
      label: 'Active Packages', 
      value: data?.stats?.activePlans ?? 0, 
      icon: Package, 
      color: 'bg-blue-50 text-blue-600', 
      sub: `${data?.stats?.totalPlans ?? 0} total records in DB` 
    },
    { label: 'Registered Users', value: data?.stats?.totalUsers ?? 0, icon: Users, color: 'bg-purple-50 text-purple-600', sub: 'All time' },
    { label: 'Total Enquiries', value: data?.stats?.totalEnquiries ?? 0, icon: MessageSquare, color: 'bg-orange-50 text-orange-600', sub: `${data?.stats?.newEnquiries} new` },
    { label: 'Trending Packages', value: data?.trendingPlans?.length ?? 0, icon: TrendingUp, color: 'bg-green-50 text-green-600', sub: 'Active' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h2 className="font-display font-bold text-2xl text-brand-navy">Overview</h2>
        <p className="text-gray-500 text-sm">Welcome back! Here's what's happening with PackGo.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 shadow-card">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="font-display font-bold text-2xl text-brand-navy">{card.value}</p>
            <p className="text-gray-500 text-sm">{card.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="font-display font-semibold text-brand-navy mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-blue" /> Recent Enquiries
          </h3>
          <div className="space-y-3">
            {data?.recentEnquiries?.length === 0 && <p className="text-gray-400 text-sm text-center py-6">No enquiries yet</p>}
            {data?.recentEnquiries?.map(enq => (
              <div key={enq._id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {enq.userName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-navy text-sm truncate">{enq.userName}</p>
                  <p className="text-gray-500 text-xs truncate">{enq.planTitle}</p>
                  <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {format(new Date(enq.createdAt), 'MMM d, h:mm a')}
                  </p>
                </div>
                <span className={`badge text-xs shrink-0 ${enq.status === 'new' ? 'bg-blue-50 text-blue-600' : enq.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {enq.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="font-display font-semibold text-brand-navy mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-brand-blue" /> Plans by Category
          </h3>
          <div className="space-y-3">
            {data?.categoryStats?.map(cat => (
              <div key={cat._id} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium capitalize text-brand-navy">{cat._id}</span>
                    <span className="text-sm text-gray-400">{cat.count} plans</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue rounded-full" style={{ width: `${Math.min((cat.count / (data?.stats.totalPlans || 1)) * 100, 100)}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Avg: {formatPrice(cat.avgPrice)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending plans */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h3 className="font-display font-semibold text-brand-navy mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-500" /> Top Trending Packages
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-gray-400 font-medium">#</th>
                <th className="text-left py-2 px-3 text-gray-400 font-medium">Package</th>
                <th className="text-left py-2 px-3 text-gray-400 font-medium">Bookings</th>
                <th className="text-left py-2 px-3 text-gray-400 font-medium">Rating</th>
              </tr>
            </thead>
            <tbody>
              {data?.trendingPlans?.map((p, i) => (
                <tr key={p.title} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-3 text-gray-400">{i + 1}</td>
                  <td className="py-3 px-3 font-medium text-brand-navy">{p.title}</td>
                  <td className="py-3 px-3 text-gray-600">{p.bookingCount}</td>
                  <td className="py-3 px-3">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      {p.rating.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}