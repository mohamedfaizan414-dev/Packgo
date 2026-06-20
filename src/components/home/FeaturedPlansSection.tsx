import { connectDB } from '@/lib/db';
import TravelPlan from '@/models/TravelPlan';
import PlanCard from './PlanCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

async function getFeatured() {
  try {
    await connectDB();
    const plans = await TravelPlan.find({ isFeatured: true, isActive: true }).limit(6).lean();
    return JSON.parse(JSON.stringify(plans));
  } catch { return []; }
}

export default async function FeaturedPlansSection() {
  const plans = await getFeatured();
  if (!plans.length) return null;
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-blue font-semibold text-sm uppercase tracking-wider mb-2">Featured</p>
            <h2 className="section-title">Most Popular Packages</h2>
          </div>
          <Link href="/packages" className="hidden sm:flex items-center gap-1 text-brand-blue font-semibold text-sm hover:gap-2 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan: Parameters<typeof PlanCard>[0]['plan'], i: number) => (
            <PlanCard key={plan._id} plan={plan} index={i} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link href="/packages" className="btn-secondary">View All Packages <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </section>
  );
}
