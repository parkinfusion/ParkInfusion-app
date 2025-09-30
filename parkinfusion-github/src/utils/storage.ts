// Storage utility for ParkInfusion app
// Handles data persistence across devices using localStorage with email-based keys

export interface UserData {
  email: string;
  therapyData: TherapyEntry[];
  stockData: StockItem[];
  notifications: NotificationSettings;
  lastSync: string;
}

export interface TherapyEntry {
  id: string;
  date: string;
  type: 'duodopa' | 'duodopa_canula';
  time: string;
  notes?: string;
}

export interface StockItem {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  expiryDate?: string;
  category: 'duodopa' | 'canula' | 'accessories';
}

export interface NotificationSettings {
  duodopa: boolean;
  canula: boolean;
  battery: boolean;
  maintenance: boolean;
  reminderText: string;
  reminderTime: string;
}

class StorageManager {
  private currentUser: string | null = null;

  setCurrentUser(email: string) {
    this.currentUser = email;
    localStorage.setItem('currentUser', email);
  }

  getCurrentUser(): string | null {
    if (!this.currentUser) {
      this.currentUser = localStorage.getItem('currentUser');
    }
    return this.currentUser;
  }

  private getUserKey(key: string): string {
    const user = this.getCurrentUser();
    if (!user) throw new Error('No user logged in');
    return `parkinfusion_${user}_${key}`;
  }

  // Therapy data methods
  saveTherapyData(data: TherapyEntry[]): void {
    try {
      const key = this.getUserKey('therapy');
      localStorage.setItem(key, JSON.stringify(data));
      this.updateLastSync();
    } catch (error) {
      console.error('Error saving therapy data:', error);
    }
  }

  getTherapyData(): TherapyEntry[] {
    try {
      const key = this.getUserKey('therapy');
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading therapy data:', error);
      return [];
    }
  }

  // Stock data methods
  saveStockData(data: StockItem[]): void {
    try {
      const key = this.getUserKey('stock');
      localStorage.setItem(key, JSON.stringify(data));
      this.updateLastSync();
    } catch (error) {
      console.error('Error saving stock data:', error);
    }
  }

  getStockData(): StockItem[] {
    try {
      const key = this.getUserKey('stock');
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading stock data:', error);
      return [];
    }
  }

  // Notification settings methods
  saveNotificationSettings(settings: NotificationSettings): void {
    try {
      const key = this.getUserKey('notifications');
      localStorage.setItem(key, JSON.stringify(settings));
      this.updateLastSync();
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  getNotificationSettings(): NotificationSettings {
    try {
      const key = this.getUserKey('notifications');
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : {
        duodopa: true,
        canula: true,
        battery: true,
        maintenance: true,
        reminderText: 'Ricordati di prendere la tua terapia Duodopa',
        reminderTime: '09:00'
      };
    } catch (error) {
      console.error('Error loading notification settings:', error);
      return {
        duodopa: true,
        canula: true,
        battery: true,
        maintenance: true,
        reminderText: 'Ricordati di prendere la tua terapia Duodopa',
        reminderTime: '09:00'
      };
    }
  }

  // Export all user data
  exportUserData(): UserData | null {
    try {
      const user = this.getCurrentUser();
      if (!user) return null;

      return {
        email: user,
        therapyData: this.getTherapyData(),
        stockData: this.getStockData(),
        notifications: this.getNotificationSettings(),
        lastSync: this.getLastSync()
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      return null;
    }
  }

  // Import user data
  importUserData(data: UserData): boolean {
    try {
      this.setCurrentUser(data.email);
      this.saveTherapyData(data.therapyData);
      this.saveStockData(data.stockData);
      this.saveNotificationSettings(data.notifications);
      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  }

  private updateLastSync(): void {
    try {
      const key = this.getUserKey('lastSync');
      localStorage.setItem(key, new Date().toISOString());
    } catch (error) {
      console.error('Error updating last sync:', error);
    }
  }

  private getLastSync(): string {
    try {
      const key = this.getUserKey('lastSync');
      return localStorage.getItem(key) || new Date().toISOString();
    } catch (error) {
      console.error('Error getting last sync:', error);
      return new Date().toISOString();
    }
  }

  // Clear all user data
  clearUserData(): void {
    try {
      const user = this.getCurrentUser();
      if (!user) return;

      const keys = ['therapy', 'stock', 'notifications', 'lastSync'];
      keys.forEach(key => {
        localStorage.removeItem(this.getUserKey(key));
      });
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }
}

export const storage = new StorageManager();