import React from 'react';
import { Drink } from '../types';
import { Plus } from 'lucide-react';

interface DrinkCardProps {
  drink: Drink;
  onClick: () => void;
}

export const DrinkCard: React.FC<DrinkCardProps> = ({ drink, onClick }) => {
  const isOutOfStock = drink.stock <= 0;

  return (
    <div 
      onClick={() => !isOutOfStock && onClick()}
      className={`relative group bg-white rounded-3xl p-3 shadow-sm border border-transparent hover:border-violet-200 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
    >
      <div className="relative aspect-square mb-3 overflow-hidden rounded-2xl bg-gray-100">
        <img 
          src={drink.image} 
          alt={drink.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Rupture
            </span>
          </div>
        )}
        {!isOutOfStock && (
          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur text-violet-900 font-bold px-3 py-1 rounded-xl text-sm shadow-sm">
            {drink.stock} en stock
          </div>
        )}
      </div>

      <div className="mt-auto">
        <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1 line-clamp-2">{drink.name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-violet-600 font-extrabold text-xl">{drink.price.toLocaleString()} F</span>
          <button className="bg-violet-100 text-violet-600 p-2 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};