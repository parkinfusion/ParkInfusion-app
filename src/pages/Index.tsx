import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Calendar from '@/components/Calendar';
import { addTherapyLog, canUseTherapyToday, getTodayTherapyType, getLowStockProducts } from '@/lib/storage';
import { Product } from '@/lib/types';
import { AlertTriangle, Pill, Syringe, FlaskConical, Bell } from 'lucide-react';

export default function Index() {
  const [canUseTherapy, setCanUseTherapy] = useState(true);
  const [todayTherapyType, setTodayTherapyType] = useState<string | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);

  const loadData = () => {
    setCanUseTherapy(canUseTherapyToday());
    setTodayTherapyType(getTodayTherapyType());
    setLowStockProducts(getLowStockProducts());
    checkNotificationTime();
  };

  const checkNotificationTime = () => {
    const notificationSettings = localStorage.getItem('notification-settings');
    if (!notificationSettings) return;

    const settings = JSON.parse(notificationSettings);
    if (!settings.enabled) return;

    const now = new Date();
    const [hours, minutes] = settings.time.split(':').map(Number);
    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes, 0, 0);

    // Check if it's within 5 minutes of notification time
    const timeDiff = Math.abs(now.getTime() - notificationTime.getTime());
    const fiveMinutes = 5 * 60 * 1000;

    if (timeDiff <= fiveMinutes && !todayTherapyType) {
      setShowNotificationAlert(true);
    }
  };

  useEffect(() => {
    loadData();
    // Check every minute for notification time
    const interval = setInterval(checkNotificationTime, 60000);
    return () => clearInterval(interval);
  }, [todayTherapyType]);

  const handleTherapy = (type: 'duodopa' | 'duodopa-canula') => {
    addTherapyLog(type);
    setShowNotificationAlert(false); // Hide notification alert after therapy
    loadData();
  };

  const snoozeNotification = () => {
    setShowNotificationAlert(false);
    // Set a timeout to show again in 15 minutes
    setTimeout(() => {
      if (!getTodayTherapyType()) {
        setShowNotificationAlert(true);
      }
    }, 15 * 60 * 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ParkInfusion</h1>
          <p className="text-gray-600">Gestione Terapia Duodopa Sottocute</p>
        </div>

        {/* Notification Alert */}
        {showNotificationAlert && (
          <Alert className="border-blue-300 bg-blue-50">
            <Bell className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 flex justify-between items-center">
              <span><strong>È ora della terapia!</strong> Non dimenticare la tua dose giornaliera.</span>
              <div className="flex gap-2 ml-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={snoozeNotification}
                  className="text-xs"
                >
                  Snooze 15min
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setShowNotificationAlert(false)}
                  className="text-xs"
                >
                  OK
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Low Stock Alerts */}
        {lowStockProducts.length > 0 && (
          <Alert className="border-orange-300 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Attenzione!</strong> Riordina: {lowStockProducts.map(p => p.name).join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {/* Therapy Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Terapia Giornaliera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayTherapyType && (
              <Alert className="border-green-300 bg-green-50">
                <FlaskConical className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Terapia di oggi completata: {todayTherapyType === 'duodopa' ? 'Duodopa' : 'Duodopa + Canula'}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={() => handleTherapy('duodopa')}
                disabled={!canUseTherapy}
                className="h-16 bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
                size="lg"
              >
                <div className="flex items-center gap-3">
                  <FlaskConical size={24} />
                  <div className="text-left">
                    <div className="font-semibold">Duodopa</div>
                    <div className="text-xs opacity-90">Siringhe + Adattatori</div>
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleTherapy('duodopa-canula')}
                disabled={!canUseTherapy}
                className="h-16 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300"
                size="lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <FlaskConical size={20} />
                    <Syringe size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Duodopa + Canula</div>
                    <div className="text-xs opacity-90">Siringhe + Canule + Adattatori</div>
                  </div>
                </div>
              </Button>
            </div>
            
            {!canUseTherapy && !todayTherapyType && (
              <p className="text-center text-sm text-gray-600">
                I pulsanti saranno disponibili domani
              </p>
            )}
          </CardContent>
        </Card>

        {/* Calendar */}
        <Calendar onUpdate={loadData} />
      </div>
    </div>
  );
}