export interface Product {
  id: string;
  name: string;
  code: string;
  stock: number;
  minThreshold: number;
}

export interface TherapyLog {
  id: string;
  date: string;
  type: 'duodopa' | 'duodopa-canula';
  timestamp: number;
}

export interface UsageReport {
  month: string;
  year: number;
  canule: number;
  siringhe: number;
  adattatori: number;
}

export const PRODUCT_IDS = {
  CANULE: 'canule',
  SIRINGHE: 'siringhe',
  ADATTATORI: 'adattatori'
} as const;