import MainLayout from '@/components/layout/MainLayout';
import { Shield, Award, Users, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="pt-20 min-h-screen">
        <div className="bg-hero-gradient py-20 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">About PackGo</h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">Your Journey, Our Passion — crafting unforgettable travel experiences since 2018.</p>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-display font-bold text-3xl text-brand-navy mb-4">Who We Are</h2>
              <p className="text-gray-600 leading-relaxed mb-4">PackGo is a Kerala-based travel company that specializes in creating personalized, handcrafted travel experiences across India and beyond. We believe every journey should tell a story.</p>
              <p className="text-gray-600 leading-relaxed">From the backwaters of Kerala to the sand dunes of Rajasthan, from the Himalayan heights to the tropical beaches of the Andamans — we bring your dream trips to life with expert planning and seamless execution.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, value: '50,000+', label: 'Happy Travelers' },
                { icon: Globe, value: '200+', label: 'Destinations' },
                { icon: Award, value: '6+ Years', label: 'Experience' },
                { icon: Shield, value: '100%', label: 'Secure Booking' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="bg-brand-light rounded-2xl p-5 text-center">
                  <div className="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center mx-auto mb-2"><Icon className="w-5 h-5 text-white" /></div>
                  <p className="font-display font-bold text-xl text-brand-navy">{value}</p>
                  <p className="text-gray-500 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-hero-gradient rounded-3xl p-10 text-center text-white">
            <h2 className="font-display font-bold text-3xl mb-3">Ready to Explore?</h2>
            <p className="text-white/70 mb-6">Let PackGo craft your perfect journey.</p>
            <a href="/packages" className="inline-flex items-center gap-2 bg-white text-brand-blue font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-sky hover:text-white transition-colors">Browse Packages</a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
