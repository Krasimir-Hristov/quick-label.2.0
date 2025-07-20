import React from 'react';

const Header = () => {
  return (
    <header className="bg-black py-8 shadow-lg border-b-5 border-[#a8c706]">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-5xl font-bold flex flex-col tracking-wide">
              <span style={{ color: '#a8c706' }}>KÖLLE</span>
              <span style={{ color: '#a8c706' }} className='ml-3'>ZOO</span>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
