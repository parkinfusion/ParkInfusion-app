import { storage } from '@/utils/storage';

export interface Product {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  category: 'siringhe' | 'canule' | 'adattatori';
  expiryDate?: string;
}

export interface TherapyLog {
  id: string;
  date: string;
  type: 'duodopa' | 'duodopa-canula';
  duration: number;
  notes?: string;
}

export interface UsageReport {
  month: string;
  siringhe: number;
  canule: number;
  adattatori: number;
}

// Initialize default products if none exist
const initializeDefaultProducts = (): Product[] => {
  return [
    {
      id: '1',
      name: 'Siringhe Duodopa 20ml',
      quantity: 10,
      minQuantity: 5,
      category: 'siringhe'
    },
    {
      id: '2', 
      name: 'Canule Sottocute 27G',
      quantity: 15,
      minQuantity: 8,
      category: 'canule'
    },
    {
      id: '3',
      name: 'Adattatori Luer Lock',
      quantity: 20,
      minQuantity: 10,
      category: 'adattatori'
    }
  ];
};

// Products management
export const getProducts = (): Product[] => {
  try {
    const stockData = storage.getStockData();
    if (stockData.length === 0) {
      const defaultProducts = initializeDefaultProducts();
      storage.saveStockData(defaultProducts.map(p => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
        minQuantity: p.minQuantity,
        category: p.category as 'duodopa' | 'canula' | 'accessories',
        expiryDate: p.expiryDate
      })));
      return defaultProducts;
    }
    
    return stockData.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      minQuantity: item.minQuantity,
      category: item.category === 'duodopa' ? 'siringhe' : 
                item.category === 'canula' ? 'canule' : 'adattatori',
      expiryDate: item.expiryDate
    }));
  } catch (error) {
    console.error('Error loading products:', error);
    return initializeDefaultProducts();
  }
};

export const updateProduct = (product: Product): void => {
  try {
    const products = getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      products[index] = product;
      storage.saveStockData(products.map(p => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
        minQuantity: p.minQuantity,
        category: p.category === 'siringhe' ? 'duodopa' : 
                  p.category === 'canule' ? 'canula' : 'accessories',
        expiryDate: p.expiryDate
      })));
    }
  } catch (error) {
    console.error('Error updating product:', error);
  }
};

export const getLowStockProducts = (): Product[] => {
  return getProducts().filter(product => product.quantity <= product.minQuantity);
};

// Therapy logs management
export const getTherapyLogs = (): TherapyLog[] => {
  try {
    return storage.getTherapyData().map(entry => ({
      id: entry.id,
      date: entry.date,
      type: entry.type,
      duration: 8, // Default duration
      notes: entry.notes
    }));
  } catch (error) {
    console.error('Error loading therapy logs:', error);
    return [];
  }
};

export const addTherapyLog = (type: 'duodopa' | 'duodopa-canula'): void => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const existingLogs = storage.getTherapyData();
    
    // Check if already logged today
    if (existingLogs.some(log => log.date === today)) {
      return;
    }
    
    const newLog = {
      id: Date.now().toString(),
      date: today,
      type: type,
      time: new Date().toTimeString().slice(0, 5),
      notes: ''
    };
    
    storage.saveTherapyData([...existingLogs, newLog]);
    
    // Update product quantities
    const products = getProducts();
    
    if (type === 'duodopa') {
      // Use 1 syringe + 1 adapter
      const syringeProduct = products.find(p => p.category === 'siringhe');
      const adapterProduct = products.find(p => p.category === 'adattatori');
      
      if (syringeProduct && syringeProduct.quantity > 0) {
        updateProduct({ ...syringeProduct, quantity: syringeProduct.quantity - 1 });
      }
      if (adapterProduct && adapterProduct.quantity > 0) {
        updateProduct({ ...adapterProduct, quantity: adapterProduct.quantity - 1 });
      }
    } else if (type === 'duodopa-canula') {
      // Use 1 syringe + 1 canula + 1 adapter
      const syringeProduct = products.find(p => p.category === 'siringhe');
      const canulaProduct = products.find(p => p.category === 'canule');
      const adapterProduct = products.find(p => p.category === 'adattatori');
      
      if (syringeProduct && syringeProduct.quantity > 0) {
        updateProduct({ ...syringeProduct, quantity: syringeProduct.quantity - 1 });
      }
      if (canulaProduct && canulaProduct.quantity > 0) {
        updateProduct({ ...canulaProduct, quantity: canulaProduct.quantity - 1 });
      }
      if (adapterProduct && adapterProduct.quantity > 0) {
        updateProduct({ ...adapterProduct, quantity: adapterProduct.quantity - 1 });
      }
    }
  } catch (error) {
    console.error('Error adding therapy log:', error);
  }
};

export const canUseTherapyToday = (): boolean => {
  const today = new Date().toISOString().split('T')[0];
  const logs = storage.getTherapyData();
  return !logs.some(log => log.date === today);
};

export const getTodayTherapyType = (): string | null => {
  const today = new Date().toISOString().split('T')[0];
  const logs = storage.getTherapyData();
  const todayLog = logs.find(log => log.date === today);
  return todayLog ? todayLog.type : null;
};

// Usage reports
export const getUsageReports = (): UsageReport[] => {
  try {
    const logs = storage.getTherapyData();
    const monthlyUsage: { [key: string]: UsageReport } = {};
    
    logs.forEach(log => {
      const date = new Date(log.date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyUsage[monthKey]) {
        monthlyUsage[monthKey] = {
          month: monthKey,
          siringhe: 0,
          canule: 0,
          adattatori: 0
        };
      }
      
      // Count usage based on therapy type
      if (log.type === 'duodopa') {
        monthlyUsage[monthKey].siringhe += 1;
        monthlyUsage[monthKey].adattatori += 1;
      } else if (log.type === 'duodopa_canula') {
        monthlyUsage[monthKey].siringhe += 1;
        monthlyUsage[monthKey].canule += 1;
        monthlyUsage[monthKey].adattatori += 1;
      }
    });
    
    return Object.values(monthlyUsage);
  } catch (error) {
    console.error('Error generating usage reports:', error);
    return [];
  }
};