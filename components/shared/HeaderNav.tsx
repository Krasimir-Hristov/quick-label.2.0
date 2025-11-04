'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { Rabbit, Dog, LogOut } from 'lucide-react';

const navigationItems = [
  { name: 'Startseite', href: '/' },
  { name: 'Etiketten', href: '/labels' },
  { name: 'Check-Liste', href: '/check-liste' },
];

export default function HeaderNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  // Не показвай навигацията на login страницата
  if (pathname === '/login') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setIsLoggedIn(false);
      router.push('/login');
    } catch (error) {
      console.error('Грешка при logout:', error);
      setIsLoggedIn(false);
      router.push('/login');
    }
  };

  return (
    <header className="bg-black border-b-4 border-[#a8c706] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo и навигация */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Rabbit className="w-8 h-8 text-[#a8c706]" />
              <div className="text-white font-extrabold text-2xl">KÖLLE ZOO</div>
              <Dog className="w-8 h-8 text-[#a8c706]" />
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-[#a8c706] text-black'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Logout бутон */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#a8c706] text-black font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-[#97b305] transition-colors cursor-pointer"
            >
              <LogOut size={18} />
              Abmelden
            </button>
          )}
        </div>

        {/* Mobile навигация */}
        <div className="md:hidden flex gap-2 pb-3">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium text-center transition-colors ${
                pathname === item.href
                  ? 'bg-[#a8c706] text-black'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
