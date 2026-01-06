'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="text-xl font-semibold text-slate-900">Vinca Wealth</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium ${pathname === '/' ? 'text-green-600' : 'text-slate-600 hover:text-green-600'}`}
            >
              Home
            </Link>
            
            <div className="relative group">
              <button className="text-sm font-medium text-slate-600 hover:text-green-600 flex items-center">
                Tools
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute hidden group-hover:block bg-white rounded-xl shadow-lg border border-slate-200 mt-2 py-2 min-w-[200px]">
                <Link href="/calculator" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  Freedom Calculator
                </Link>
                <Link href="/dashboard" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  Dashboard
                </Link>
              </div>
            </div>

            <Link 
              href="/calculator" 
              className="btn-primary"
            >
              Start Planning
            </Link>
          </div>

          <button className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}