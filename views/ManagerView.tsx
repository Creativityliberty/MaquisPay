import React, { useState, useEffect } from 'react';
import { User, Drink, Sale, StockMovement } from '../types';
import { api } from '../services/mockDb';
import { Logo } from '../components/Logo';
import { Button } from '../components/Button';
import { 
  LogOut, TrendingUp, Package, History, ArrowRightLeft, 
  AlertCircle, Calendar, Eye, EyeOff, Ban, ChevronDown, CheckCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface Props {
  user: User;
  onLogout: () => void;
}

type Tab = 'dashboard' | 'stock' | 'sales' | 'movements';

export const ManagerView: React.FC<Props> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  
  // Stock Editing State
  const [isAddingStock, setIsAddingStock] = useState<string | null>(null);
  const [stockInput, setStockInput] = useState<number>(0);

  const fetchData = () => {
    setDrinks(api.getDrinks());
    setSales(api.getSales());
    setMovements(api.getMovements());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStock = (drinkId: string) => {
    if (stockInput > 0) {
      api.addStock(drinkId, stockInput, "Approvisionnement Manager", user.id);
      setStockInput(0);
      setIsAddingStock(null);
      fetchData();
    }
  };

  const handleToggleActive = (id: string) => {
    api.toggleDrinkStatus(id);
    fetchData();
  };

  const handleCancelSale = (saleId: string) => {
    if (confirm("Confirmer l'annulation de cette vente ? Le stock sera restitué.")) {
      try {
        api.cancelSale(saleId, user);
        fetchData();
      } catch (e: any) {
        alert(e.message);
      }
    }
  };

  // --- RENDER HELPERS ---
  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-start justify-between group hover:shadow-md transition-shadow">
      <div>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900">{value}</p>
      </div>
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
  );

  const renderDashboard = () => {
    const revenue = sales.filter(s => s.status === 'COMPLETED').reduce((acc, s) => acc + s.total, 0);
    const lowStock = drinks.filter(d => d.stock < 10).length;
    
    // Prepare chart data (Last 7 Days or Sales)
    const chartData = sales
      .filter(s => s.status === 'COMPLETED')
      .slice(0, 10)
      .map(s => ({
        name: new Date(s.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        amount: s.total
      })).reverse();

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Chiffre d'Affaires" value={`${revenue.toLocaleString()} F`} icon={TrendingUp} color="bg-violet-500" />
          <StatCard title="Stock Critique" value={lowStock} icon={AlertCircle} color="bg-orange-500" />
          <StatCard title="Ventes Validées" value={sales.filter(s => s.status === 'COMPLETED').length} icon={CheckCircle} color="bg-emerald-500" />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 h-96 relative overflow-hidden">
          <h3 className="text-xl font-bold text-gray-800 mb-8">Performance des Ventes</h3>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
              <Tooltip 
                cursor={{fill: '#F3F4F6', radius: 8}}
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)'}} 
              />
              <Bar dataKey="amount" radius={[8, 8, 8, 8]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="#8B5CF6" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderStock = () => (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-6 font-bold">Produit</th>
              <th className="p-6 font-bold">Prix Unit.</th>
              <th className="p-6 font-bold">Stock</th>
              <th className="p-6 font-bold">Statut</th>
              <th className="p-6 font-bold text-right">Mise à jour</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {drinks.map(drink => (
              <tr key={drink.id} className="group hover:bg-gray-50/80 transition-colors">
                <td className="p-5 pl-6">
                  <div className="flex items-center gap-4">
                    <img src={drink.image} className={`w-12 h-12 rounded-2xl object-cover shadow-sm ${!drink.isActive && 'grayscale opacity-50'}`} alt="" />
                    <span className={`font-bold text-gray-800 ${!drink.isActive && 'text-gray-400'}`}>{drink.name}</span>
                  </div>
                </td>
                <td className="p-5 font-mono text-gray-600">{drink.price.toLocaleString()} F</td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    drink.stock === 0 ? 'bg-red-50 text-red-500 border-red-100' : 
                    drink.stock < 10 ? 'bg-orange-50 text-orange-500 border-orange-100' : 
                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    {drink.stock} unités
                  </span>
                </td>
                <td className="p-5">
                   <button 
                    onClick={() => handleToggleActive(drink.id)}
                    className={`flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-xl transition-all ${
                      drink.isActive 
                        ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                   >
                     {drink.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                     {drink.isActive ? 'Actif' : 'Masqué'}
                   </button>
                </td>
                <td className="p-5 text-right pr-6">
                  {isAddingStock === drink.id ? (
                    <div className="flex items-center justify-end gap-2 animate-in slide-in-from-right-2">
                       <input 
                        type="number" 
                        className="w-24 p-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-violet-500 outline-none"
                        placeholder="+ Qty"
                        autoFocus
                        min="1"
                        value={stockInput || ''}
                        onChange={(e) => setStockInput(parseInt(e.target.value) || 0)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddStock(drink.id)}
                       />
                       <button onClick={() => handleAddStock(drink.id)} className="bg-violet-600 text-white p-2 rounded-xl shadow-lg shadow-violet-200">
                         <CheckCircle size={18} />
                       </button>
                       <button onClick={() => setIsAddingStock(null)} className="text-gray-400 p-2 hover:bg-gray-100 rounded-xl">
                         <Ban size={18} />
                       </button>
                    </div>
                  ) : (
                    <Button variant="secondary" className="py-2 px-4 text-sm rounded-xl" onClick={() => setIsAddingStock(drink.id)}>
                      + Stock
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="space-y-4 animate-in fade-in">
      {sales.map(sale => (
        <div key={sale.id} className={`bg-white p-6 rounded-[2rem] border transition-all ${sale.status === 'CANCELLED' ? 'border-red-100 bg-red-50/20' : 'border-gray-100 hover:shadow-md'}`}>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
             <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${sale.status === 'CANCELLED' ? 'bg-red-100 text-red-500' : 'bg-violet-50 text-violet-600'}`}>
                  {sale.status === 'CANCELLED' ? <Ban size={24} /> : <Calendar size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-800 text-lg">{new Date(sale.date).toLocaleString()}</p>
                    {sale.status === 'CANCELLED' && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">Annulé</span>}
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                     Vendeur: <span className="font-medium text-gray-700">{sale.sellerName}</span>
                     <span className="text-gray-300">•</span>
                     ID: <span className="font-mono text-xs">{sale.id.slice(0,8)}</span>
                  </p>
                </div>
             </div>

             <div className="flex-1 md:px-8">
               <div className="flex flex-wrap gap-2">
                 {sale.items.map((item, i) => (
                   <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${sale.status === 'CANCELLED' ? 'bg-white border-gray-200 text-gray-400' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
                      <span className="font-bold text-xs bg-white px-1.5 rounded-md shadow-sm border border-gray-100">x{item.quantity}</span>
                      <span className="text-sm font-medium">{item.name}</span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="flex items-center gap-6 justify-end min-w-[200px]">
                <div className="text-right">
                  <p className={`text-2xl font-extrabold ${sale.status === 'CANCELLED' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {sale.total.toLocaleString()} F
                  </p>
                </div>
                {sale.status !== 'CANCELLED' && (
                  <button 
                    onClick={() => handleCancelSale(sale.id)}
                    className="p-3 bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 rounded-2xl transition-all shadow-sm group"
                    title="Annuler la vente"
                  >
                    <Ban size={20} className="group-hover:scale-110 transition-transform"/>
                  </button>
                )}
             </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderMovements = () => (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in">
      <div className="p-8 border-b border-gray-50">
        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
          <ArrowRightLeft className="text-violet-500" />
          Audit du Stock
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-6 font-bold">Horodatage</th>
              <th className="p-6 font-bold">Mouvement</th>
              <th className="p-6 font-bold">Produit</th>
              <th className="p-6 font-bold">Quantité</th>
              <th className="p-6 font-bold">Raison</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {movements.map(mov => {
               const drink = drinks.find(d => d.id === mov.drinkId);
               return (
                <tr key={mov.id} className="hover:bg-gray-50/50">
                  <td className="p-5 pl-6 text-sm text-gray-500 font-mono">
                    {new Date(mov.date).toLocaleString()}
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                      mov.type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                       {mov.type === 'IN' ? '+' : '-'} {mov.type}
                    </span>
                  </td>
                  <td className="p-5 font-bold text-gray-800">{drink?.name || 'Produit Supprimé'}</td>
                  <td className="p-5 font-bold">{mov.quantity}</td>
                  <td className="p-5 text-sm text-gray-500">{mov.reason}</td>
                </tr>
               );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4">
             <Logo size="sm" />
             <div className="h-8 w-px bg-gray-300 mx-2"></div>
             <div>
               <h1 className="text-2xl font-bold text-gray-900">Espace Manager</h1>
               <p className="text-sm text-gray-500 font-medium">Connecté: {user.name}</p>
             </div>
           </div>

           <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200">
              {(['dashboard', 'stock', 'sales', 'movements'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                    activeTab === tab 
                      ? 'bg-gray-900 text-white shadow-lg' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {tab === 'dashboard' && <TrendingUp size={18} />}
                  {tab === 'stock' && <Package size={18} />}
                  {tab === 'sales' && <History size={18} />}
                  {tab === 'movements' && <ArrowRightLeft size={18} />}
                  <span className="capitalize">{tab === 'dashboard' ? 'Tableau de bord' : tab}</span>
                </button>
              ))}
           </div>

           <button onClick={onLogout} className="bg-white text-gray-400 p-4 rounded-2xl border border-gray-200 hover:text-red-500 hover:border-red-200 shadow-sm transition-all">
             <LogOut size={20} />
           </button>
        </div>

        {/* CONTENT */}
        <div className="min-h-[600px]">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'stock' && renderStock()}
          {activeTab === 'sales' && renderSales()}
          {activeTab === 'movements' && renderMovements()}
        </div>

      </div>
    </div>
  );
};