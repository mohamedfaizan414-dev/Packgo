'use client';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hi PackGo! I'd like to get in touch.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`;
    window.open(`https://wa.me/919544661551?text=${encodeURIComponent(msg)}`, '_blank');
    toast.success('Redirecting to WhatsApp...');
  };

  const inputCls = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue';

  return (
    <MainLayout>
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="bg-hero-gradient py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl font-bold text-white mb-2">Get In Touch</motion.h1>
            <p className="text-white/70">We'd love to help plan your next adventure</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display font-bold text-2xl text-brand-navy mb-6">Contact Information</h2>
              <div className="space-y-5">
                {[
                  { icon: Phone, label: 'Phone / WhatsApp', value: '+91 95446 61551', href: 'tel:+919544661551' },
                  { icon: Mail, label: 'Email', value: 'hello@packgo.in', href: 'mailto:hello@packgo.in' },
                  { icon: MapPin, label: 'Location', value: 'Kerala, India', href: '#' },
                ].map(({ icon: Icon, label, value, href }) => (
                  <a key={label} href={href} className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
                    <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-brand-blue" /></div>
                    <div><p className="text-xs text-gray-400">{label}</p><p className="font-semibold text-brand-navy">{value}</p></div>
                  </a>
                ))}
                <a href="https://wa.me/919544661551" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-2xl transition-colors w-full">
                  <MessageCircle className="w-5 h-5" /> Chat with us on WhatsApp
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-8">
              <h2 className="font-display font-bold text-2xl text-brand-navy mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[['name','Full Name','text'],['email','Email','email'],['phone','Phone Number','tel']].map(([k,l,t]) => (
                  <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1">{l}</label>
                    <input type={t} required={k !== 'phone'} value={form[k as keyof typeof form]} onChange={set(k)} className={inputCls} /></div>
                ))}
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea required rows={5} value={form.message} onChange={set('message')} placeholder="Tell us about your dream trip..." className={inputCls} /></div>
                <button type="submit" className="w-full btn-primary justify-center py-3.5">Send via WhatsApp</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
