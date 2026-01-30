import React, { useState, useEffect } from 'react';
import { Drink, CartItem, User } from '../types';
import { api } from '../services/mockDb';
import { DrinkCard } from '../components/DrinkCard';
import { QuantityModal } from '../components/QuantityModal';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { Trash2, ShoppingBag, LogOut, Search, User as UserIcon } from 'lucide-react';

interface Props {
  user: User;
  onLogout: () => void;
}

export const SellerView: React.FC<Props> = ({ user, onLogout }) => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [search, setSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchDrinks = () => {
    // Only show active drinks to seller
    setDrinks(api.getDrinks().filter(d => d.isActive));
  };

  useEffect(() => {
    fetchDrinks();
  }, []);

  const addToCart = (quantity: number) => {
    if (!selectedDrink) return;

    setCart(prev => {
      const existing = prev.find(item => item.drinkId === selectedDrink.id);
      if (existing) {
        return prev.map(item => 
          item.drinkId === selectedDrink.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        drinkId: selectedDrink.id,
        name: selectedDrink.name,
        image: selectedDrink.image,
        quantity,
        unitPrice: selectedDrink.price
      }];
    });
    setSelectedDrink(null);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.drinkId !== id));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 800)); 
      api.createSale(cart, user);
      
      setCart([]);
      fetchDrinks(); 
      setSuccessMsg("Vente encaissée avec succès !");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e: any) {
      alert("Erreur: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const filteredDrinks = drinks.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans">
      {/* LEFT: PRODUCTS */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header */}
        <div className="h-24 px-8 flex items-center justify-between bg-white border-b border-gray-100 z-10">
          <Logo size="sm" />
          
          <div className="flex-1 max-w-xl mx-12 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher une boisson..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border-none shadow-inner rounded-2xl py-4 pl-12 pr-4 text-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-violet-500/20 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
               <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold">
                 {user.name.charAt(0)}
               </div>
               <div className="leading-tight hidden md:block">
                 <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Vendeur</p>
                 <p className="font-bold text-gray-800 text-sm">{user.name}</p>
               </div>
             </div>
             <button onClick={onLogout} className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-colors shadow-sm">
               <LogOut size={20} />
             </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredDrinks.map(drink => (
              <DrinkCard key={drink.id} drink={drink} onClick={() => setSelectedDrink(drink)} />
            ))}
          </div>
          {filteredDrinks.length === 0 && (
             <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-4">
               <Search size={48} opacity={0.2} />
               <p>Aucun produit correspondant</p>
             </div>
          )}
        </div>
      </div>

      {/* RIGHT: CART */}
      <div className="w-[420px] bg-white border-l border-gray-100 flex flex-col h-full shadow-2xl z-20 relative">
        <div className="p-8 border-b border-gray-50 bg-gradient-to-b from-white to-gray-50/50">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-3">
              Panier
              <span className="bg-violet-100 text-violet-700 text-xs px-2 py-1 rounded-full">{cart.reduce((a,b)=>a+b.quantity,0)} items</span>
            </h2>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Commande</p>
              <p className="text-sm font-mono text-gray-600">#{Date.now().toString().slice(-6)}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-6">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                <ShoppingBag size={40} opacity={0.2} />
              </div>
              <p className="font-medium">Commencez une vente</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.drinkId} className="flex gap-4 p-4 bg-gray-50 rounded-3xl border border-transparent hover:border-violet-100 hover:shadow-lg transition-all group animate-in slide-in-from-right-4">
                 <img src={item.image} className="w-16 h-16 rounded-2xl object-cover bg-white shadow-sm" alt="" />
                 <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                       <h4 className="font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                       <span className="font-extrabold text-violet-700">{(item.unitPrice * item.quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-xl shadow-sm border border-gray-100">
                        <span className="text-xs font-bold text-gray-400">QTE</span>
                        <span className="text-sm font-bold text-gray-800">{item.quantity}</span>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.drinkId)} 
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                 </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-30">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 font-medium">Total à payer</span>
            <div className="text-right">
              <span className="text-4xl font-extrabold text-gray-900 tracking-tight">{cartTotal.toLocaleString()}</span>
              <span className="text-sm text-gray-400 font-bold ml-1">FCFA</span>
            </div>
          </div>
          
          <Button 
            fullWidth 
            onClick={handleCheckout} 
            disabled={cart.length === 0 || isProcessing}
            className={`shadow-xl shadow-violet-200 ${isProcessing ? 'animate-pulse' : ''}`}
          >
            {isProcessing ? 'Traitement...' : successMsg ? 'Succès !' : 'Valider la commande'}
          </Button>
        </div>
      </div>

      {selectedDrink && (
        <QuantityModal 
          drink={selectedDrink} 
          onClose={() => setSelectedDrink(null)} 
          onConfirm={addToCart} 
        />
      )}
    </div>
  );
};