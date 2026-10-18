'use client';
import React from 'react';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-300 py-16 w-full border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tighter text-white">
                Lumiere<span className="text-rose-500">.</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Experience the ultimate relaxation and rejuvenation at Lumiere Spa Studio. Your sanctuary for modern wellness and premium self-care.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-300">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-300">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-300">
                <FaTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: 'Home Sanctuary', href: '/' },
                { name: 'Spa Services Menu', href: '/services' },
                { name: 'Reserve Appointment', href: '/booking' },
                { name: 'Member Dashboard', href: '/dashboard' },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-zinc-400 text-sm hover:text-rose-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-rose-500 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="flex flex-col gap-5">
              <li className="flex items-start gap-3 text-zinc-400 text-sm">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0" />
                <span>123 Serenity Avenue, <br /> Wellness District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <Phone className="w-5 h-5 text-rose-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <Mail className="w-5 h-5 text-rose-500 shrink-0" />
                <span>hello@lumierespa.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Newsletter</h4>
            <p className="text-zinc-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and updates.
            </p>
            <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 transition-colors"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-rose-500 hover:bg-rose-600 rounded-lg text-white transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm" suppressHydrationWarning>
            © {new Date().getFullYear()} Lumiere Spa Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
