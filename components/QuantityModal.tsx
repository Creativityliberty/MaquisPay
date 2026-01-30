import React, { useState } from 'react';
import { Drink } from '../types';
import { Button } from './Button';
import { X, Minus, Plus } from 'lucide-react';

interface Props {
  drink: Drink;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
}

export const QuantityModal: React.FC<Props> = ({ drink, onClose, onConfirm }) => {
  const [qty, setQty] = useState(1);

  const increment = () => {
    if (qty < drink.stock) setQty(q => q + 1);
  };
  
  const decrement = () => {
    if (qty > 1) setQty(q => q - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
             <img src={drink.image} alt="" className="w-16 h-16 rounded-2xl object-cover bg-gray-100" />
             <div>
               <h3 className="text-xl font-bold text-gray-800">{drink.name}</h3>
               <p className="text-gray-500">{drink.price} F / unité</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="bg-violet-50 rounded-3xl p-4 flex items-center justify-between mb-8">
          <button 
            onClick={decrement}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-violet-900 shadow-sm active:scale-90 transition-transform"
          >
            <Minus size={24} />
          </button>
          <span className="text-4xl font-extrabold text-violet-900">{qty}</span>
          <button 
            onClick={increment}
            disabled={qty >= drink.stock}
            className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-violet-900 shadow-sm active:scale-90 transition-transform ${qty >= drink.stock ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-lg font-bold px-2">
            <span>Total</span>
            <span className="text-violet-600">{(qty * drink.price).toLocaleString()} F</span>
          </div>
          <Button fullWidth onClick={() => onConfirm(qty)}>
            Ajouter au panier
          </Button>
        </div>
      </div>
    </div>
  );
};