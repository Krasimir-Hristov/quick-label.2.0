import React from 'react';
import { Bird, Bone, Cat, Dog, Fish, PawPrint, Rabbit, Snail, Turtle } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-black py-8 shadow-lg border-b-5 border-[#a8c706]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Left paw prints */}
          <div className="flex items-center space-x-4">

          
          <Dog size={100} className="text-[#a8c706]" />
          <PawPrint size={30} className="text-[#a8c706] opacity-100" />
          <PawPrint size={40} className="text-[#a8c706] opacity-100" />
          <PawPrint size={50} className="text-[#a8c706] opacity-100" />
          <PawPrint size={70} className="text-[#a8c706] opacity-100" />
          <Bone size={110} className="text-[#a8c706]" />
          </div>
          
          
          {/* Logo */}
          <div className="text-center">
            <h1 className="font-extrabold flex flex-col tracking-wide">
              <span style={{ color: '#a8c706' }} className='text-7xl'>KÖLLE</span>
              <span style={{ color: '#a8c706' }} className='text-7xl'>ZOO</span>
            </h1>
          </div>
          
          {/* Right cat icon */}
          <div className="flex items-center space-x-4">
          <Fish size={110} className="text-[#a8c706] transform -scale-x-100" />

            <PawPrint size={70} className="text-[#a8c706] opacity-100" />
            <PawPrint size={50} className="text-[#a8c706] opacity-100" />
            <PawPrint size={40} className="text-[#a8c706] opacity-100" />
            <PawPrint size={30} className="text-[#a8c706] opacity-100" />
            <Cat size={100} className="text-[#a8c706]" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
