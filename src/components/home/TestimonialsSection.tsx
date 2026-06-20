'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Loader2 } from 'lucide-react';

interface Testimonial {
  name: string;
  rating: number;
  text: string;
  trip: string;
  avatar: string;
}

// Elegant structural fallback matching your exact Screenshot 2026-06-19 112544.png state exactly
const backupTestimonials: Testimonial[] = [
  { name: 'Priya Menon', rating: 5, text: 'PackGo made our honeymoon in the Maldives absolutely magical. Every detail was perfect — from the overwater villa to the sunset dinner on the beach.', trip: 'Maldives Honeymoon', avatar: 'PM' },
  { name: 'Rahul Sharma', rating: 5, text: 'The Golden Triangle tour was phenomenal. Our guide was incredibly knowledgeable and the hotel choices were top-notch. Will definitely book again!', trip: 'Golden Triangle Tour', avatar: 'RS' },
  { name: 'Anjali Thomas', rating: 5, text: 'The Kerala backwaters experience on the houseboat was pure bliss. PackGo handled everything seamlessly — no stress, just pure enjoyment.', trip: 'Kerala Backwaters', avatar: 'AT' },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveTestimonials = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/reviews');
        const data = await res.json();
        
        if (res.ok && data.reviews && data.reviews.length > 0) {
          // ✅ FIXED: Safely maps text keys accurately so database reviews are validated and rendered properly
          const validReviews = data.reviews
            .filter((r: any) => r.text && r.text.trim().length > 0)
            .map((r: any) => ({
              name: r.name,
              rating: Number(r.rating || 5),
              text: r.text,
              trip: r.trip,
              avatar: r.avatar || (r.name ? r.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'TR')
            }));

          setTestimonials(validReviews.length > 0 ? validReviews : backupTestimonials);
        } else {
          setTestimonials(backupTestimonials);
        }
      } catch (error) {
        console.error('Error fetching global feedback items:', error);
        setTestimonials(backupTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveTestimonials();
  }, []);

  return (
    <section className="py-20 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-brand-blue font-semibold text-sm uppercase tracking-wider mb-2">Traveler Stories</p>
          <h2 className="section-title text-4xl font-bold text-slate-900 tracking-tight">What Our Travelers Say</h2>
          <p className="text-gray-500 mt-3">Thousands of happy travelers, endless unforgettable memories.</p>
        </motion.div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
            <p className="text-xs font-medium">Aggregating traveler logs...</p>
          </div>
        ) : (
          /* Cards Grid Wrapper Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} 
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow flex flex-col justify-between border border-gray-100/50"
              >
                <div>
                  <Quote className="w-8 h-8 text-brand-sky/40 mb-3" />
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
                    "{t.text}"
                  </p>
                </div>
                
                <div>
                  {/* Interactive Dynamic Star Rating Row */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400 border-none" />
                    ))}
                  </div>
                  
                  {/* User Profile Footer Metadata Wrapper */}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                      {t.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-brand-navy text-sm truncate">{t.name}</p>
                      <p className="text-gray-400 text-xs truncate">{t.trip}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}