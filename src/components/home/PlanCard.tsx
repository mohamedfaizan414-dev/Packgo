'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin, Users, TrendingUp, Heart } from 'lucide-react';
import { cn, formatPrice, getDurationLabel, getDiscountPercent } from '@/lib/utils';
import { useState } from 'react';

interface Plan {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  destination: string;
  coverImage: string;
  price: number;
  discountedPrice?: number;
  duration: { days: number; nights: number };
  category: string;
  rating: number;
  reviewCount: number;
  isTrending: boolean;
  difficulty: string;
  maxGroupSize: number;
  // ✅ Added optional reviews type definition to prevent TypeScript compilation errors
  reviews?: any[]; 
}

export default function PlanCard({ plan, index = 0 }: { plan: Plan; index?: number }) {
  const [wishlisted, setWishlisted] = useState(false);
  const discount = plan.discountedPrice ? getDiscountPercent(plan.price, plan.discountedPrice) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card group cursor-pointer">
      <Link href={`/plan/${plan.slug}`}>
        <div className="relative overflow-hidden aspect-[4/3]">
          <Image src={plan.coverImage} alt={plan.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 100vw, 33vw" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-card-gradient" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {plan.isTrending && (
              <span className="badge bg-orange-500 text-white"><TrendingUp className="w-3 h-3" /> Trending</span>
            )}
            {discount > 0 && (
              <span className="badge bg-green-500 text-white">{discount}% OFF</span>
            )}
          </div>

          {/* Wishlist button */}
          <button onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors shadow">
            <Heart className={cn('w-4 h-4 transition-colors', wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500')} />
          </button>

          {/* Bottom info */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-xs font-semibold">{Number(plan.rating || 0).toFixed(1)}</span>
              {/* ✅ FIXED: Prioritizes the true live reviews array length if it exists, falling back cleanly to the pre-cached reviewCount counter */}
              <span className="text-white/70 text-xs">({plan.reviews?.length ?? plan.reviewCount ?? 0})</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display font-semibold text-brand-navy text-base leading-tight line-clamp-2 group-hover:text-brand-blue transition-colors">
              {plan.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-2">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{plan.destination}</span>
          </div>

          <p className="text-gray-500 text-xs line-clamp-2 mb-3">{plan.shortDescription}</p>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {getDurationLabel(plan.duration.days, plan.duration.nights)}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Max {plan.maxGroupSize}</span>
            <span className={cn('badge text-xs capitalize',
              plan.difficulty === 'easy' ? 'bg-green-50 text-green-700' :
              plan.difficulty === 'moderate' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700')}>
              {plan.difficulty}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              {plan.discountedPrice ? (
                <>
                  <p className="text-brand-blue font-bold text-lg font-display">{formatPrice(plan.discountedPrice)}</p>
                  <p className="text-gray-400 text-xs line-through">{formatPrice(plan.price)}</p>
                </>
              ) : (
                <p className="text-brand-blue font-bold text-lg font-display">{formatPrice(plan.price)}</p>
              )}
              <p className="text-gray-400 text-xs">per person</p>
            </div>
            <span className="btn-primary text-xs px-4 py-2">View Details</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}