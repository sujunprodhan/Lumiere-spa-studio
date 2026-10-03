'use client';

import { useState } from 'react';
import NavLink from '@/components/buttons/NavLink';
import Container from './Container';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800 transition-all duration-300 shadow-sm">
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="shrink-0 md:flex-1">
            <Link
              href={'/'}
              className="text-2xl font-bold tracking-widest text-[#580F41] dark:text-[#36081b] font-serif"
            >
              Lumiere Spa
            </Link>
          </div>

          {/* Desktop Navigation Links (Center) */}
          <div className="hidden md:flex flex-1 justify-center">
            <ul className="flex items-center space-x-8">{navItem}</ul>
          </div>

          <div className="hidden md:flex flex-1 justify-end items-center space-x-4">
            <Link
              href={'/login'}
              className="font-medium hover:text-white hover:bg-[#7a155a] transition-colors border px-5 py-2 rounded-md"
            >
              Login
            </Link>
            <Link
              href={'/register'}
              className="px-5 py-2 bg-[#580F41] text-white rounded-md hover:bg-[#7a155a] transition-colors font-medium"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#580F41] focus:outline-none"
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

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
          <ul className="flex flex-col space-y-4 px-6 py-4">
            {navItem}
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
              <Link
                href={'/login'}
                className="block text-[#580F41] font-medium hover:text-amber-500 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href={'/register'}
                className="block text-center px-5 py-2 bg-[#580F41] text-white rounded-md hover:bg-[#7a155a] transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
