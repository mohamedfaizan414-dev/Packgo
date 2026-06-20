'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscribed! Get ready for amazing travel deals 🌍');
    setEmail('');
  };
  return (
    <section className="py-20 bg-hero-gradient">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Get Exclusive Travel Deals</h2>
          <p className="text-white/70 mb-8">Subscribe and be the first to know about flash sales, new destinations, and travel tips.</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50 text-sm" />
            <button type="submit" className="flex items-center justify-center gap-2 bg-white text-brand-blue font-semibold px-6 py-3.5 rounded-xl hover:bg-brand-sky hover:text-white transition-colors text-sm">
              <Send className="w-4 h-4" /> Subscribe
            </button>
          </form>
          <p className="text-white/40 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  );
}
