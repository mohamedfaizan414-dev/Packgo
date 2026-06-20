'use client';
import { motion } from 'framer-motion';
import { cn, CATEGORIES } from '@/lib/utils';

interface Props {
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  const all = [{ value: 'all', label: 'All', emoji: '🌍' }, ...CATEGORIES];
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {all.map(cat => (
        <motion.button key={cat.value} whileTap={{ scale: 0.95 }} onClick={() => onChange(cat.value)}
          className={cn('flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border',
            active === cat.value
              ? 'bg-brand-blue text-white border-brand-blue shadow-md'
              : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue hover:text-brand-blue')}>
          <span>{cat.emoji}</span>
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
}
