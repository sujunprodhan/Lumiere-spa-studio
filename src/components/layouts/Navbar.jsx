'use client';

import { useState, useRef, useEffect } from 'react';
import NavLink from '@/components/buttons/NavLink';
import Link from 'next/link';
import Container from './Container';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  User,
  LayoutDashboard,
  LogOut,
  Calendar,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsOpen(false);
    router.push('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const navItem = (
    <>
      <li>
        <NavLink href={'/'}>Home</NavLink>
      </li>
      <li>
        <NavLink href={'/services'}>Services</NavLink>
      </li>
      <li>
        <NavLink href={'/booking'}>Booking</NavLink>
      </li>
      {mounted && user && (
        <li>
          <NavLink href={'/dashboard'}>Dashboard</NavLink>
        </li>
      )}
      {mounted && (user?.role === 'admin' || user?.email === 'jabiq@mailinator.com') && (
        <li>
          <NavLink href={'/admin'}>Admin</NavLink>
        </li>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/85 dark:bg-zinc-950/85 border-b border-gray-200/80 dark:border-zinc-800 transition-all duration-300 shadow-xs">
      <Container>
        <div className="flex items-center justify-between h-20">
          <div className="shrink-0 md:flex-1">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl sm:text-4xl font-serif font-bold tracking-tighter text-[#580F41] dark:text-rose-100 group-hover:opacity-90 transition-opacity">
                Lumiere<span className="text-rose-500 animate-pulse">.</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            <ul className="flex items-center space-x-8">{navItem}</ul>
          </div>

          <div className="hidden md:flex flex-1 justify-end items-center space-x-4 min-h-[44px]">
            {!mounted ? (
              <div className="w-28 h-9" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-200 shadow-xs cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#580F41] to-[#9c1f75] text-white flex items-center justify-center font-semibold text-xs shadow-xs group-hover:scale-105 transition-transform">
                    {getInitials(user.name)}
                  </div>

                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1 max-w-[110px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium">
                      Member
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${
                      isProfileOpen ? 'rotate-180 text-[#580F41]' : ''
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs font-medium text-zinc-400">Signed in as</p>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {user.email}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-[10px] font-medium text-[#580F41] dark:text-rose-300">
                        <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                        <span>Sanctuary Tier Member</span>
                      </div>
                    </div>

                    <div className="py-1">
                      {(user?.role === 'admin' || user?.email === 'jabiq@mailinator.com') && (
                        <Link
                          href="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 hover:bg-amber-100/80 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>Admin Concierge</span>
                        </Link>
                      )}

                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-[#580F41] dark:hover:text-rose-300 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/booking"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-[#580F41] dark:hover:text-rose-300 transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-zinc-400" />
                        <span>My Bookings</span>
                      </Link>
                    </div>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href={'/login'}
                  className="font-medium text-zinc-700 dark:text-zinc-200 hover:text-[#580F41] dark:hover:text-white transition-colors border border-zinc-200 dark:border-zinc-800 px-5 py-2 rounded-xl text-sm"
                >
                  Login
                </Link>
                <Link
                  href={'/register'}
                  className="px-5 py-2 bg-linear-to-r from-[#580F41] to-[#7a155a] text-white rounded-xl hover:opacity-90 shadow-xs transition-opacity font-medium text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#580F41] dark:text-rose-400 focus:outline-none p-2 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800 shadow-xl">
          <ul className="flex flex-col space-y-3 px-6 py-4">
            {navItem}

            <div className="flex flex-col space-y-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
              {mounted && user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#580F41] to-[#9c1f75] text-white flex items-center justify-center font-bold text-sm">
                      {getInitials(user.name)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-zinc-900 dark:text-white">
                        {user.name}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  {(user?.role === 'admin' || user?.email === 'jabiq@mailinator.com') && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300 py-2 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/40"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Admin Concierge</span>
                    </Link>
                  )}

                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 py-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#580F41] dark:text-rose-400" />
                    <span>Go to Dashboard</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-medium text-sm hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href={'/login'}
                    className="block text-[#580F41] dark:text-rose-400 font-medium py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href={'/register'}
                    className="block text-center px-5 py-2.5 bg-linear-to-r from-[#580F41] to-[#7a155a] text-white rounded-xl font-medium text-sm shadow-xs"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
