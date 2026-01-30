import React from 'react';

export const Logo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`relative flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-violet-200 ${size === 'lg' ? 'w-12 h-12 text-2xl' : 'w-10 h-10 text-xl'}`}>
        M
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
      </div>
      <div>
        <h1 className={`font-extrabold text-gray-900 leading-none tracking-tight ${size === 'lg' ? 'text-2xl' : 'text-xl'}`}>
          Maquis<span className="text-violet-600">Pay</span>
        </h1>
        {size === 'lg' && <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">POS System</span>}
      </div>
    </div>
  );
};