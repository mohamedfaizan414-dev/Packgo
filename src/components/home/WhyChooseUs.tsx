'use client';
import { motion } from 'framer-motion';
import { Shield, Headphones, Award, MapPin, CreditCard, Clock } from 'lucide-react';

const features = [
  { icon: Shield, title: 'Secure Booking', desc: '100% secure payments and booking protection for every trip.', color: 'bg-blue-50 text-blue-600' },
  { icon: Headphones, title: '24/7 Support', desc: 'Our travel experts are always available to assist you anytime.', color: 'bg-purple-50 text-purple-600' },
  { icon: Award, title: 'Best Price Guarantee', desc: 'Find a better deal anywhere? We will match or beat it.', color: 'bg-orange-50 text-orange-600' },
  { icon: MapPin, title: 'Expert Guides', desc: 'Local expert guides who know every hidden gem of the destination.', color: 'bg-green-50 text-green-600' },
  { icon: CreditCard, title: 'Easy EMI', desc: 'Book now and pay in easy monthly installments with zero extra cost.', color: 'bg-pink-50 text-pink-600' },
  { icon: Clock, title: 'Flexible Cancellation', desc: 'Plans changed? Cancel up to 72 hours before for a full refund.', color: 'bg-teal-50 text-teal-600' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <p className="text-brand-blue font-semibold text-sm uppercase tracking-wider mb-2">Why PackGo</p>
          <h2 className="section-title">Travel Smarter, Not Harder</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">We make every aspect of your journey easy, safe, and unforgettable.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 p-6 rounded-2xl border border-gray-100 hover:border-brand-blue/20 hover:shadow-card transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}>
                <f.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-brand-navy mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
