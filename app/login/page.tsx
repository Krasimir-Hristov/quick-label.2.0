'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Cat, Dog, Fish, Key, Lock, PawPrint, User } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Успешен login - обновяваме състоянието и пренасочваме към главната страница
        setIsLoggedIn(true);
        router.push('/');
      } else {
        // Грешка при login
        setError('Неправилно потребителско име или парола');
      }
    } catch (error) {
      setError('Възникна грешка при свързването със сървъра');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-black flex items-center justify-center px-4'>
      {/* Фонови животински икони за декорация */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-10 left-10 opacity-10'>
          <Dog size={120} className='text-[#a8c706]' />
        </div>
        <div className='absolute top-20 right-20 opacity-10'>
          <Cat size={100} className='text-[#a8c706]' />
        </div>
        <div className='absolute bottom-20 left-20 opacity-10'>
          <Fish size={80} className='text-[#a8c706]' />
        </div>
        <div className='absolute bottom-10 right-10 opacity-10'>
          <PawPrint size={60} className='text-[#a8c706]' />
        </div>
        <div className='absolute top-1/2 left-1/4 opacity-5'>
          <PawPrint size={40} className='text-[#a8c706]' />
        </div>
        <div className='absolute top-1/3 right-1/3 opacity-5'>
          <PawPrint size={35} className='text-[#a8c706]' />
        </div>
      </div>

      {/* Основен контейнер за login формата */}
      <div className='w-full max-w-md relative z-10'>
        {/* Logo секция */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-[#a8c706] rounded-full mb-4'>
            <Lock size={32} className='text-black' />
          </div>
          <h1 className='text-4xl font-bold text-[#a8c706] mb-2'>KÖLLE ZOO</h1>
          <p className='text-gray-300 text-lg'>Etiketten-Generator</p>
          <div className='flex justify-center items-center mt-4 space-x-2'>
            <PawPrint size={20} className='text-[#a8c706] opacity-70' />
            <span className='text-gray-400 text-sm'>
              Anmeldung erforderlich
            </span>
            <PawPrint size={20} className='text-[#a8c706] opacity-70' />
          </div>
        </div>

        {/* Login форма */}
        <div className='bg-white rounded-2xl shadow-2xl p-8 border-4 border-[#a8c706]'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Потребителско име */}
            <div>
              <label
                htmlFor='username'
                className='flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2'
              >
                <User size={16} className='text-[#a8c706]' />
                Benutzername
              </label>
              <input
                id='username'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#a8c706] focus:ring-2 focus:ring-[#a8c706] focus:ring-opacity-20 transition-all duration-200 text-gray-900 placeholder-gray-500'
                placeholder='Geben Sie Ihren Benutzernamen ein'
                required
                disabled={isLoading}
              />
            </div>

            {/* Парола */}
            <div>
              <label
                htmlFor='password'
                className='flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2'
              >
                <Key size={16} className='text-[#a8c706]' />
                Passwort
              </label>
              <input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#a8c706] focus:ring-2 focus:ring-[#a8c706] focus:ring-opacity-20 transition-all duration-200 text-gray-900 placeholder-gray-500'
                placeholder='Geben Sie Ihr Passwort ein'
                required
                disabled={isLoading}
              />
            </div>

            {/* Грешка */}
            {error && (
              <div className='bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm'>
                {error}
              </div>
            )}

            {/* Бутон за вписване */}
            <Button
              type='submit'
              disabled={isLoading}
              className='w-full bg-[#a8c706] hover:bg-[#97b305] text-black font-bold py-3 px-6 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
            >
              {isLoading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin'></div>
                  Anmeldung läuft...
                </div>
              ) : (
                <div className='flex items-center justify-center cursor-pointer gap-2'>
                  <Lock size={20} />
                  Anmelden
                </div>
              )}
            </Button>
          </form>

          {/* Декоративни елементи в дъното */}
          <div className='mt-8 pt-6 border-t border-gray-200'>
            <div className='flex justify-center items-center space-x-4 opacity-50'>
              <PawPrint size={16} className='text-[#a8c706]' />
              <span className='text-xs text-gray-500'>Sicherer Zugang</span>
              <PawPrint size={16} className='text-[#a8c706]' />
            </div>
          </div>
        </div>

        {/* Долна информация */}
        <div className='text-center mt-6'>
          <p className='text-gray-400 text-sm'>
            © 2024 Kölle Zoo Etiketten-Generator
          </p>
        </div>
      </div>
    </div>
  );
}
