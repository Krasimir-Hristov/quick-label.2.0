'use client';

import { ClipboardCheck } from 'lucide-react';

export default function CheckListePage() {
  return (
    <main className='min-h-screen bg-black py-8'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='flex justify-center items-center gap-4 mb-4'>
              <ClipboardCheck size={60} className='text-[#a8c706]' />
            </div>
            <h1 className='text-6xl font-bold text-[#a8c706] mb-4'>
              Check-Liste
            </h1>
            <p className='text-xl text-gray-300'>
              Erstellen und verwalten Sie Check-Listen
            </p>
          </div>

          {/* Content Area */}
          <div className='bg-white rounded-lg shadow-md p-8'>
            <div className='text-center'>
              <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
                Willkommen bei Check-Listen
              </h2>
              <p className='text-gray-600 mb-6'>
                Diese Funktion wird bald verfügbar sein.
              </p>
              <div className='inline-block p-4 bg-[#a8c706] bg-opacity-10 rounded-lg'>
                <ClipboardCheck size={80} className='text-[#a8c706]' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
