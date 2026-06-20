import Link from 'next/link';
import { Globe, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-blue rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">Pack<span className="text-brand-sky">Go</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">Your Journey, Our Passion. Crafting unforgettable travel experiences since 2018.</p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 hover:bg-brand-blue rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {[['Home', '/'], ['Packages', '/packages'], ['Destinations', '/destinations'], ['About Us', '/about'], ['Contact', '/contact']].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-brand-sky transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Trip Types</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {['Adventure Tours', 'Beach Holidays', 'Honeymoon Packages', 'Family Tours', 'Cultural Trips', 'Wildlife Safaris'].map(item => (
                <li key={item}><Link href={`/packages?category=${item.toLowerCase().split(' ')[0]}`} className="hover:text-brand-sky transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-base mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 text-brand-sky mt-0.5 shrink-0" /><a href="tel:+919544661551" className="hover:text-white">+91 95446 61551</a></li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 text-brand-sky mt-0.5 shrink-0" /><a href="mailto:hello@packgo.in" className="hover:text-white">hello@packgo.in</a></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-brand-sky mt-0.5 shrink-0" /><span>Kerala, India</span></li>
            </ul>
            <a href="https://wa.me/919544661551" target="_blank" rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
              <Phone className="w-4 h-4" /> WhatsApp Us
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} PackGo. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
