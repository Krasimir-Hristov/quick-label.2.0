'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import {
  Bird,
  Bone,
  Cat,
  Dog,
  Fish,
  LogOut,
  PawPrint,
  Rabbit,
  Snail,
  Turtle,
} from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  // Функция за logout
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      setIsLoggedIn(false); // Обновяваме състоянието веднага
      router.push('/login');
    } catch (error) {
      console.error('Грешка при logout:', error);
      // Дори ако има грешка, пренасочваме към login
      setIsLoggedIn(false);
      router.push('/login');
    }
  };

  return (
    <header className='bg-black py-8 shadow-lg border-b-5 border-[#a8c706] relative'>
      {/* Logout бутон в горния десен ъгъл - показва се само ако потребителят е влязъл */}
      {isLoggedIn && (
        <div className='absolute justify-center items-center right-4 z-10'>
          <button
            onClick={handleLogout}
            className='bg-[#a8c706] hover:bg-[#97b305] text-black  font-semibold py-2 px-4 rounded-lg shadow-md cursor-pointer transition-colors duration-200 flex items-center gap-2'
          >
            <LogOut size={18} />
            Abmelden
          </button>
        </div>
      )}

      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center'>
          {/* Left paw prints */}
          <div className='flex items-center space-x-4'>
            <Dog size={100} className='text-[#a8c706]' />
            <PawPrint size={30} className='text-[#a8c706] opacity-100' />
            <PawPrint size={40} className='text-[#a8c706] opacity-100' />
            <PawPrint size={50} className='text-[#a8c706] opacity-100' />
            <PawPrint size={70} className='text-[#a8c706] opacity-100' />
            <Bone size={110} className='text-[#a8c706]' />
          </div>

          {/* Logo */}
          <div className='text-center'>
            <h1 className='font-extrabold flex flex-col tracking-wide'>
              <span style={{ color: '#a8c706' }} className='text-7xl'>
                KÖLLE
              </span>
              <span style={{ color: '#a8c706' }} className='text-7xl'>
                ZOO
              </span>
            </h1>
          </div>

          {/* Right cat icon */}
          <div className='flex items-center space-x-4'>
            <Fish
              size={110}
              className='text-[#a8c706] transform -scale-x-100'
            />

            <PawPrint size={70} className='text-[#a8c706] opacity-100' />
            <PawPrint size={50} className='text-[#a8c706] opacity-100' />
            <PawPrint size={40} className='text-[#a8c706] opacity-100' />
            <PawPrint size={30} className='text-[#a8c706] opacity-100' />
            <Cat size={100} className='text-[#a8c706]' />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
