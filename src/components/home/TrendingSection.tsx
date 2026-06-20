import { connectDB } from '@/lib/db';
import TravelPlan from '@/models/TravelPlan';
import PlanCard from './PlanCard';
import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';

async function getTrending() {
  try {
    await connectDB();
    const plans = await TravelPlan.find({ isTrending: true, isActive: true }).limit(3).lean();
    return JSON.parse(JSON.stringify(plans));
  } catch { return []; }
}

export default async function TrendingSection() {
  const plans = await getTrending();
  if (!plans.length) return null;
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Hot Right Now
            </p>
            <h2 className="section-title">Trending Destinations</h2>
          </div>
          <Link href="/packages?trending=true" className="hidden sm:flex items-center gap-1 text-brand-blue font-semibold text-sm hover:gap-2 transition-all">
            See All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan: Parameters<typeof PlanCard>[0]['plan'], i: number) => (
            <PlanCard key={plan._id} plan={plan} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
