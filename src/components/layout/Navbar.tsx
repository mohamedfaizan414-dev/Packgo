'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Packages', href: '/packages' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isAdmin = (session?.user as { role?: string })?.role === 'admin';

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b',
      scrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-sm border-slate-100' 
        : 'bg-white/90 backdrop-blur-md border-slate-200/50' // ✅ FIXED: Glassmorphic fallback ensures solid legibility everywhere
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* ── BRAND LOGO (EXACT MATCH TO YOUR LOCATION PIN SYMBOL) ── */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg 
              viewBox="0 0 100 100" 
              className="w-8 h-8 transform group-hover:scale-105 transition-transform duration-200"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M50 15C33.4 15 20 28.4 20 45C20 54.4 24.5 61.6 30 68L50 85L70 68C75.5 61.6 80 54.4 80 45C80 28.4 66.6 15 50 15ZM50 57C43.4 57 38 51.6 38 45C38 38.4 43.4 33 50 33C56.6 33 62 38.4 62 45C62 51.6 56.6 57 50 57Z" 
                fill="#0284c7" 
              />
              <path 
                d="M50 33C43.4 33 38 38.4 38 45C38 48.5 40 51.5 43 53C40 45 44 38 52 36C50.7 34.1 52 33 50 33Z" 
                fill="#0f172a" 
              />
            </svg>
            <span className="font-display font-bold text-xl tracking-tight">
              <span className="text-slate-900">Pack</span>
              <span className="text-sky-600">Go</span>
            </span>
          </Link>

          {/* ── DESKTOP NAV LINKS ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'text-sky-600 bg-sky-50 font-semibold'
                    : 'text-slate-700 hover:text-sky-600 hover:bg-slate-50' // ✅ FIXED: Slate gray guarantees visibility on bright imagery
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── DESKTOP AUTH CONTROLS ── */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-1.5 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  {session.user?.name?.split(' ')[0]}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50"
                    >
                      {isAdmin && (
                        <Link 
                          href="/admin/dashboard" 
                          onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-sky-600" /> Admin Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={() => { signOut(); setUserMenu(false); }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-sm font-medium text-slate-700 hover:text-sky-600 px-4 py-2 rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link href="/auth/register" className="btn-primary text-sm px-5 py-2.5 shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* ── MOBILE MENU TRIGGER ── */}
          <button 
            onClick={() => setOpen(!open)} 
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU SLIDEOUT PANEL ── */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 shadow-xl"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname === link.href ? 'text-sky-600 bg-sky-50 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
                {session ? (
                  <>
                    {isAdmin && (
                      <Link 
                        href="/admin/dashboard" 
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-sky-600 bg-sky-50"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={() => { signOut(); setOpen(false); }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 text-left w-full"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/auth/login" 
                      onClick={() => setOpen(false)}
                      className="block text-center px-4 py-3 rounded-xl text-sm font-medium border border-slate-200 text-slate-700 bg-white"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/auth/register" 
                      onClick={() => setOpen(false)}
                      className="block text-center btn-primary justify-center shadow-sm"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}