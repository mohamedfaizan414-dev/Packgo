'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Users, Shield } from 'lucide-react';

const destinations = ['Goa', 'Kerala', 'Rajasthan', 'Maldives', 'Andaman', 'Manali', 'Sikkim'];

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/packages?search=${encodeURIComponent(query)}`);
  };

  return (
    <section className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #4FC3F7 0%, transparent 50%), radial-gradient(circle at 75% 20%, #1A73E8 0%, transparent 50%)' }} />
      </div>

      {/* Floating elements */}
      <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 right-10 md:right-32 w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm hidden md:flex items-center justify-center text-3xl">
        ✈️
      </motion.div>
      <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-32 right-20 md:right-48 w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-sm hidden md:flex items-center justify-center text-2xl">
        🏖️
      </motion.div>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-40 left-10 md:left-32 w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-sm hidden md:flex items-center justify-center text-xl">
        🏔️
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-32 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-sm px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            Rated #1 Travel Agency in South India
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
            Explore the World<br />
            <span className="text-brand-sky">Your Way</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">
            Handcrafted travel experiences with expertly designed itineraries, seamless bookings, and memories that last forever.
          </motion.p>

          {/* Search bar */}
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 bg-white rounded-2xl p-2 shadow-2xl mb-8 max-w-2xl">
            <div className="flex items-center gap-2 flex-1 px-3">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input value={query} onChange={e => setQuery(e.target.value)} type="text"
                placeholder="Where do you want to go?"
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 text-sm focus:outline-none py-2" />
            </div>
            <button type="submit" className="btn-primary justify-center sm:justify-start">
              Search Packages
            </button>
          </motion.form>

          {/* Popular destinations */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="flex flex-wrap items-center gap-2">
            <span className="text-white/60 text-sm flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Popular:</span>
            {destinations.map(dest => (
              <button key={dest} onClick={() => router.push(`/packages?search=${dest}`)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 text-xs px-3 py-1.5 rounded-full transition-colors border border-white/10">
                {dest}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
          className="mt-16 grid grid-cols-3 gap-4 max-w-lg">
          {[
            { icon: Users, value: '50,000+', label: 'Happy Travelers' },
            { icon: MapPin, value: '200+', label: 'Destinations' },
            { icon: Shield, value: '100%', label: 'Secure Booking' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Icon className="w-5 h-5 text-brand-sky" />
              </div>
              <p className="font-display font-bold text-xl text-white">{value}</p>
              <p className="text-white/60 text-xs">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
