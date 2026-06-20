'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

// Updated premium static locations with targeted high-quality travel images
const targetedDestinations = [
  { name: 'Kashmir', image: 'https://kashyapholidays.in/image/cache/catalog/images_logo/kashmir/kashmir-6-800x800.jpg', searchKeyword: 'kashmir' },
  { name: 'Rajasthan', image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=80', searchKeyword: 'rajasthan' },
  { name: 'Himachal Pradesh', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&auto=format&fit=crop&q=80', searchKeyword: 'himachal' },
  { name: 'Uttarakhand', image: 'https://www.ercotravels.com/blog/wp-content/uploads/2017/08/uk.jpg', searchKeyword: 'uttarakhand' },
  { name: 'Punjab', image: 'https://wallpaperbat.com/img/7872700-rural-punjab.jpg', searchKeyword: 'punjab' },
  { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=80', searchKeyword: 'delhi' },
];

interface Plan {
  destination?: string;
  region?: string;
  title?: string;
  isActive?: boolean;
}

export default function DestinationsPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchLiveCounts = async () => {
      try {
        // Fetch your active plans from the database
        const res = await fetch('/api/plans?limit=100');
        if (!res.ok) throw new Error('Failed to fetch package registry');
        
        const data = await res.json();
        const rawPlans: Plan[] = data.plans || data.data || [];

        const tempCounts: Record<string, number> = {};
        
        // Initialize keys
        targetedDestinations.forEach(d => {
          tempCounts[d.name] = 0;
        });

        // Smart partial substring matching logic
        rawPlans.forEach((plan) => {
          const planDest = (plan.destination || '').toLowerCase();
          const planRegion = (plan.region || '').toLowerCase();
          const planTitle = (plan.title || '').toLowerCase();

          targetedDestinations.forEach((target) => {
            const keyword = target.searchKeyword;
            
            // Checks if the search keyword appears anywhere in the destination, region, or title text
            if (planDest.includes(keyword) || planRegion.includes(keyword) || planTitle.includes(keyword)) {
              tempCounts[target.name] += 1;
            }
          });
        });

        setCounts(tempCounts);
      } catch (error) {
        console.error('Failed to parse dynamic package aggregation profile:', error);
      }
    };

    fetchLiveCounts();
  }, []);

  return (
    <MainLayout>
      <div className="pt-20 min-h-screen bg-gray-50">
        {/* Banner */}
        <div className="bg-hero-gradient py-16 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Destinations</h1>
          <p className="text-white/70">Discover India's most breathtaking places and beyond</p>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetedDestinations.map(dest => {
              const packageCount = counts[dest.name] ?? 0;

              return (
                <Link 
                  key={dest.name} 
                  href={`/packages?search=${encodeURIComponent(dest.name)}`}
                  className="group relative overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="aspect-[4/4] overflow-hidden">
                    <img 
                      src={dest.image} 
                      alt={dest.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-card-gradient" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display font-bold text-white text-xl">{dest.name}</h3>
                    <p className="text-white/70 text-sm">
                      {packageCount} {packageCount === 1 ? 'package' : 'packages'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}