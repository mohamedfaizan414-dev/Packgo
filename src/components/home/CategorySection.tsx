'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/utils';

const categoryImages: Record<string, string> = {
  adventure: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
  cultural: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400',
  honeymoon: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400',
  family: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400',
  wildlife: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400',
  pilgrimage: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=400',
  cruise: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=400',
};

export default function CategorySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-brand-blue font-semibold text-sm uppercase tracking-wider mb-2">Explore by Type</p>
          <h2 className="section-title">Find Your Perfect Trip</h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.value} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <Link href={`/packages?category=${cat.value}`}
                className="group relative overflow-hidden rounded-2xl aspect-square block">
                <img src={categoryImages[cat.value]} alt={cat.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 text-white">
                  <span className="text-2xl mb-1">{cat.emoji}</span>
                  <span className="font-display font-semibold text-sm">{cat.label}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
