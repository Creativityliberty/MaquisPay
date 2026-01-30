import { Drink, Sale, User, UserRole, StockMovement, CartItem } from '../types';

// --- CONSTANTS & KEYS ---
const STORAGE_KEYS = {
  DRINKS: 'maquis_db_drinks',
  SALES: 'maquis_db_sales',
  MOVEMENTS: 'maquis_db_movements',
  USERS: 'maquis_db_users',
  INITIALIZED: 'maquis_db_initialized_v3'
};

// --- SEED DATA ---
const SEED_USERS: User[] = [
  { 
    id: '11111111-1111-1111-1111-111111111111', 
    name: 'Manager Maquis', 
    role: UserRole.MANAGER, 
    email: 'manager@maquis.com',
    pin: '0000' 
  },
  { 
    id: '22222222-2222-2222-2222-222222222222', 
    name: 'Vendeuse Awa', 
    role: UserRole.SELLER, 
    email: 'awa@maquis.com',
    pin: '1234' 
  },
];

const SEED_DRINKS: Drink[] = [
  { id: 'd1-coca', name: 'Coca Cola 50cl', price: 1000, stock: 0, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80', category: 'Soda', isActive: true },
  { id: 'd2-fanta', name: 'Fanta Orange', price: 1000, stock: 0, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=400&q=80', category: 'Soda', isActive: true },
  { id: 'd3-sprite', name: 'Sprite', price: 1000, stock: 0, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=400&q=80', category: 'Soda', isActive: true },
  { id: 'd4-water', name: 'Eau Minérale', price: 500, stock: 0, image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=400&q=80', category: 'Eau', isActive: true },
  { id: 'd5-beer1', name: 'Beaufort', price: 1500, stock: 0, image: 'https://images.unsplash.com/photo-1608270586620-2485246391d8?auto=format&fit=crop&w=400&q=80', category: 'Bière', isActive: true },
  { id: 'd6-beer2', name: 'Flag Spéciale', price: 1500, stock: 0, image: 'https://images.unsplash.com/photo-1669280367355-6c70b6b23617?auto=format&fit=crop&w=400&q=80', category: 'Bière', isActive: true },
  { id: 'd7-beer3', name: 'Guinness', price: 2000, stock: 0, image: 'https://images.unsplash.com/photo-1610332857021-36f6d8955132?auto=format&fit=crop&w=400&q=80', category: 'Bière', isActive: true },
  { id: 'd8-wine', name: 'Vin Rouge', price: 3000, stock: 0, image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=400&q=80', category: 'Vin', isActive: true },
  { id: 'd9-beer4', name: 'Heineken', price: 1800, stock: 0, image: 'https://images.unsplash.com/photo-1618641986557-1ecd23095910?auto=format&fit=crop&w=400&q=80', category: 'Bière', isActive: true },
  { id: 'd10-malta', name: 'Malta Guinness', price: 1200, stock: 0, image: 'https://images.unsplash.com/photo-1582234057635-71719b48b78f?auto=format&fit=crop&w=400&q=80', category: 'Soda', isActive: true },
];

// --- UTILS ---
const getStorage = <T>(key: string, fallback: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

const setStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const uuid = () => crypto.randomUUID();

// --- API IMPLEMENTATION ---

export const api = {
  // 1. INITIALIZATION
  init: () => {
    if (localStorage.getItem(STORAGE_KEYS.INITIALIZED)) return;

    console.log("Initializing MaquisPay Database...");
    
    // Setup Users
    setStorage(STORAGE_KEYS.USERS, SEED_USERS);

    // Setup Drinks & Initial Stock
    let drinks = [...SEED_DRINKS];
    let movements: StockMovement[] = [];
    let sales: Sale[] = [];
    const managerId = SEED_USERS[0].id;
    const sellerId = SEED_USERS[1].id;

    // A. Initial Stock (50 for each)
    drinks = drinks.map(d => {
      movements.push({
        id: uuid(),
        drinkId: d.id,
        type: 'IN',
        quantity: 50,
        date: new Date().toISOString(),
        reason: 'Stock Initial',
        createdBy: managerId
      });
      return { ...d, stock: 50 };
    });

    // B. Simulate Sales
    // Sale 1: 2 Coca, 1 Beaufort
    const sale1Id = uuid();
    const sale1Date = new Date(Date.now() - 86400000).toISOString(); // Yesterday
    const sale1Items = [
      { drinkId: 'd1-coca', quantity: 2, unitPrice: 1000, name: 'Coca Cola 50cl', image: '' },
      { drinkId: 'd5-beer1', quantity: 1, unitPrice: 1500, name: 'Beaufort', image: '' }
    ];
    
    sale1Items.forEach(item => {
      const d = drinks.find(x => x.id === item.drinkId)!;
      d.stock -= item.quantity;
      movements.push({
        id: uuid(),
        drinkId: d.id,
        type: 'OUT',
        quantity: item.quantity,
        date: sale1Date,
        reason: `Vente ${sale1Id.slice(0,6)}`,
        createdBy: sellerId
      });
    });

    sales.push({
      id: sale1Id,
      date: sale1Date,
      total: 3500,
      sellerId: sellerId,
      sellerName: 'Vendeuse Awa',
      items: sale1Items.map(i => ({...i, image: drinks.find(d=>d.id===i.drinkId)!.image})),
      status: 'COMPLETED'
    });

    // Sale 2: 3 Water, 2 Flag
    const sale2Id = uuid();
    const sale2Date = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago
    const sale2Items = [
      { drinkId: 'd4-water', quantity: 3, unitPrice: 500, name: 'Eau Minérale', image: '' },
      { drinkId: 'd6-beer2', quantity: 2, unitPrice: 1500, name: 'Flag Spéciale', image: '' }
    ];

    sale2Items.forEach(item => {
      const d = drinks.find(x => x.id === item.drinkId)!;
      d.stock -= item.quantity;
      movements.push({
        id: uuid(),
        drinkId: d.id,
        type: 'OUT',
        quantity: item.quantity,
        date: sale2Date,
        reason: `Vente ${sale2Id.slice(0,6)}`,
        createdBy: sellerId
      });
    });

    sales.push({
      id: sale2Id,
      date: sale2Date,
      total: 4500,
      sellerId: sellerId,
      sellerName: 'Vendeuse Awa',
      items: sale2Items.map(i => ({...i, image: drinks.find(d=>d.id===i.drinkId)!.image})),
      status: 'COMPLETED'
    });

    // Save all
    setStorage(STORAGE_KEYS.DRINKS, drinks);
    setStorage(STORAGE_KEYS.MOVEMENTS, movements);
    setStorage(STORAGE_KEYS.SALES, sales);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  },

  // 2. AUTH
  login: async (pin: string): Promise<User | null> => {
    api.init(); // Ensure db is ready
    const users = getStorage<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
    return users.find(u => u.pin === pin) || null;
  },

  // 3. READS
  getDrinks: (): Drink[] => getStorage(STORAGE_KEYS.DRINKS, []),
  getSales: (): Sale[] => getStorage<Sale[]>(STORAGE_KEYS.SALES, []).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  getMovements: (): StockMovement[] => getStorage<StockMovement[]>(STORAGE_KEYS.MOVEMENTS, []).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),

  // 4. WRITES
  addStock: (drinkId: string, quantity: number, reason: string, userId: string) => {
    const drinks = api.getDrinks();
    const drink = drinks.find(d => d.id === drinkId);
    if (!drink) return;

    drink.stock += quantity;
    
    const movements = api.getMovements();
    movements.push({
      id: uuid(),
      drinkId,
      type: 'IN',
      quantity,
      date: new Date().toISOString(),
      reason,
      createdBy: userId
    });

    setStorage(STORAGE_KEYS.DRINKS, drinks);
    setStorage(STORAGE_KEYS.MOVEMENTS, movements);
  },

  createSale: (items: CartItem[], seller: User): Sale => {
    const drinks = api.getDrinks();
    const movements = api.getMovements();
    const now = new Date().toISOString();
    const saleId = uuid();

    // Verification Logic
    for (const item of items) {
      const drink = drinks.find(d => d.id === item.drinkId);
      if (!drink) throw new Error(`Produit introuvable: ${item.name}`);
      if (!drink.isActive) throw new Error(`Produit inactif: ${item.name}`);
      if (drink.stock < item.quantity) throw new Error(`Stock insuffisant: ${item.name}`);
    }

    // Execution Logic
    items.forEach(item => {
      const drink = drinks.find(d => d.id === item.drinkId)!;
      drink.stock -= item.quantity;
      movements.push({
        id: uuid(),
        drinkId: drink.id,
        type: 'OUT',
        quantity: item.quantity,
        date: now,
        reason: `Vente ${saleId.slice(0,6)}`,
        createdBy: seller.id
      });
    });

    const newSale: Sale = {
      id: saleId,
      date: now,
      total: items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0),
      sellerId: seller.id,
      sellerName: seller.name,
      items,
      status: 'COMPLETED'
    };

    const sales = api.getSales();
    sales.unshift(newSale); // Add to top

    setStorage(STORAGE_KEYS.DRINKS, drinks);
    setStorage(STORAGE_KEYS.MOVEMENTS, movements);
    setStorage(STORAGE_KEYS.SALES, sales);

    return newSale;
  },

  cancelSale: (saleId: string, manager: User) => {
    const sales = api.getSales();
    const sale = sales.find(s => s.id === saleId);
    
    if (!sale) throw new Error("Vente introuvable");
    if (sale.status === 'CANCELLED') throw new Error("Vente déjà annulée");

    // Update Status
    sale.status = 'CANCELLED';

    // Restore Stock
    const drinks = api.getDrinks();
    const movements = api.getMovements();
    const now = new Date().toISOString();

    sale.items.forEach(item => {
      const drink = drinks.find(d => d.id === item.drinkId);
      if (drink) {
        drink.stock += item.quantity;
        movements.push({
          id: uuid(),
          drinkId: drink.id,
          type: 'IN',
          quantity: item.quantity,
          date: now,
          reason: `Annulation ${saleId.slice(0,6)}`,
          createdBy: manager.id
        });
      }
    });

    setStorage(STORAGE_KEYS.SALES, sales);
    setStorage(STORAGE_KEYS.DRINKS, drinks);
    setStorage(STORAGE_KEYS.MOVEMENTS, movements);
  },

  toggleDrinkStatus: (drinkId: string) => {
    const drinks = api.getDrinks();
    const drink = drinks.find(d => d.id === drinkId);
    if (drink) {
      drink.isActive = !drink.isActive;
      setStorage(STORAGE_KEYS.DRINKS, drinks);
    }
  }
};