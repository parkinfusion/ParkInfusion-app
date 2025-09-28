import { Product, TherapyLog, UsageReport, PRODUCT_IDS } from './types';

const STORAGE_KEYS = {
  PRODUCTS: 'parkinfusion_products',
  THERAPY_LOGS: 'parkinfusion_therapy_logs',
  USAGE_REPORTS: 'parkinfusion_usage_reports'
};

// Initialize default products
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: PRODUCT_IDS.CANULE,
    name: 'Canule',
    code: 'CAN001',
    stock: 10,
    minThreshold: 3
  },
  {
    id: PRODUCT_IDS.SIRINGHE,
    name: 'Siringhe',
    code: 'SIR001',
    stock: 15,
    minThreshold: 5
  },
  {
    id: PRODUCT_IDS.ADATTATORI,
    name: 'Adattatori',
    code: 'ADA001',
    stock: 8,
    minThreshold: 2
  }
];

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  return JSON.parse(stored);
};

export const updateProduct = (productId: string, updates: Partial<Product>): void => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === productId);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }
};

export const adjustStock = (productId: string, change: number): void => {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (product) {
    product.stock = Math.max(0, product.stock + change);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }
};

export const getTherapyLogs = (): TherapyLog[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.THERAPY_LOGS);
  return stored ? JSON.parse(stored) : [];
};

export const addTherapyLog = (type: 'duodopa' | 'duodopa-canula'): void => {
  const logs = getTherapyLogs();
  const today = new Date().toISOString().split('T')[0];
  
  const newLog: TherapyLog = {
    id: Date.now().toString(),
    date: today,
    type,
    timestamp: Date.now()
  };
  
  logs.push(newLog);
  localStorage.setItem(STORAGE_KEYS.THERAPY_LOGS, JSON.stringify(logs));
  
  // Deduct stock based on therapy type
  if (type === 'duodopa') {
    adjustStock(PRODUCT_IDS.SIRINGHE, -1);
    adjustStock(PRODUCT_IDS.ADATTATORI, -1);
  } else {
    adjustStock(PRODUCT_IDS.SIRINGHE, -1);
    adjustStock(PRODUCT_IDS.CANULE, -1);
    adjustStock(PRODUCT_IDS.ADATTATORI, -1);
  }
  
  // Update usage reports
  updateUsageReport(type);
};

export const canUseTherapyToday = (): boolean => {
  const logs = getTherapyLogs();
  const today = new Date().toISOString().split('T')[0];
  return !logs.some(log => log.date === today);
};

export const getTodayTherapyType = (): string | null => {
  const logs = getTherapyLogs();
  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(log => log.date === today);
  return todayLog ? todayLog.type : null;
};

const updateUsageReport = (type: 'duodopa' | 'duodopa-canula'): void => {
  const reports = getUsageReports();
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  
  let report = reports.find(r => r.month === monthKey);
  if (!report) {
    report = {
      month: monthKey,
      year: now.getFullYear(),
      canule: 0,
      siringhe: 0,
      adattatori: 0
    };
    reports.push(report);
  }
  
  if (type === 'duodopa') {
    report.siringhe += 1;
    report.adattatori += 1;
  } else {
    report.siringhe += 1;
    report.canule += 1;
    report.adattatori += 1;
  }
  
  localStorage.setItem(STORAGE_KEYS.USAGE_REPORTS, JSON.stringify(reports));
};

export const getUsageReports = (): UsageReport[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.USAGE_REPORTS);
  return stored ? JSON.parse(stored) : [];
};

export const getLowStockProducts = (): Product[] => {
  const products = getProducts();
  return products.filter(product => product.stock <= product.minThreshold);
};