import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Settings, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NotificationSettings {
  enabled: boolean;
  time: string;
  lastNotified: string | null;
  snoozedUntil: string | null;
  customText: string;
}

export default function Notifications() {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    time: '08:15',
    lastNotified: null,
    snoozedUntil: null,
    customText: 'È ora della terapia! Ricorda di prendere i tuoi farmaci per il Parkinson.'
  });
  const [showAlert, setShowAlert] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEditingText, setIsEditingText] = useState(false);
  const [tempText, setTempText] = useState('');

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      // Add default customText if it doesn't exist
      if (!parsedSettings.customText) {
        parsedSettings.customText = 'È ora della terapia! Ricorda di prendere i tuoi farmaci per il Parkinson.';
      }
      setSettings(parsedSettings);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Check for notifications
  useEffect(() => {
    if (!settings.enabled) return;

    const now = new Date();
    const [hours, minutes] = settings.time.split(':').map(Number);
    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes, 0, 0);

    const currentTimeStr = now.toTimeString().slice(0, 5);
    const notificationTimeStr = settings.time;
    const today = now.toDateString();

    // Check if it's time for notification
    if (currentTimeStr === notificationTimeStr && settings.lastNotified !== today) {
      // Check if snoozed
      if (settings.snoozedUntil) {
        const snoozeTime = new Date(settings.snoozedUntil);
        if (now < snoozeTime) return;
      }

      setShowAlert(true);
      setSettings(prev => ({ ...prev, lastNotified: today, snoozedUntil: null }));
    }
  }, [currentTime, settings.enabled, settings.time, settings.lastNotified, settings.snoozedUntil]);

  const handleToggle = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, enabled }));
  };

  const handleTimeChange = (time: string) => {
    setSettings(prev => ({ ...prev, time }));
  };

  const handleSnooze = () => {
    const snoozeTime = new Date();
    snoozeTime.setMinutes(snoozeTime.getMinutes() + 15);
    setSettings(prev => ({ ...prev, snoozedUntil: snoozeTime.toISOString() }));
    setShowAlert(false);
  };

  const handleDismiss = () => {
    setShowAlert(false);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        alert('Notifiche browser abilitate! Riceverai promemoria anche quando l\'app è chiusa.');
      }
    }
  };

  const startEditingText = () => {
    setIsEditingText(true);
    setTempText(settings.customText);
  };

  const saveCustomText = () => {
    setSettings(prev => ({ ...prev, customText: tempText }));
    setIsEditingText(false);
    setTempText('');
  };

  const cancelEditingText = () => {
    setIsEditingText(false);
    setTempText('');
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Promemoria Terapia</h1>
          <p className="text-gray-600">Configura i tuoi reminder per i farmaci</p>
        </div>
      </div>

      {/* Notification Alert */}
      {showAlert && (
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <Bell className="h-4 w-4 text-orange-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <strong className="text-orange-800">Promemoria!</strong>
              <p className="text-orange-700">{settings.customText}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <Button size="sm" variant="outline" onClick={handleSnooze}>
                <Clock className="h-4 w-4 mr-1" />
                Snooze 15min
              </Button>
              <Button size="sm" onClick={handleDismiss}>
                OK
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Settings Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Impostazioni Notifiche
          </CardTitle>
          <CardDescription>
            Configura quando ricevere i promemoria per la terapia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Abilita Promemoria</Label>
              <p className="text-sm text-gray-600">
                Ricevi notifiche per ricordare la terapia
              </p>
            </div>
            <div className="flex items-center gap-2">
              {settings.enabled ? (
                <Bell className="h-4 w-4 text-green-600" />
              ) : (
                <BellOff className="h-4 w-4 text-gray-400" />
              )}
              <Switch
                checked={settings.enabled}
                onCheckedChange={handleToggle}
              />
            </div>
          </div>

          {/* Time Setting */}
          <div className="space-y-2">
            <Label htmlFor="notification-time" className="text-base font-medium">
              Orario Promemoria
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="notification-time"
                type="time"
                value={settings.time}
                onChange={(e) => handleTimeChange(e.target.value)}
                disabled={!settings.enabled}
                className="w-32"
              />
              <span className="text-sm text-gray-600">
                Orario corrente: {currentTime.toLocaleTimeString('it-IT', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>

          {/* Custom Text Setting */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Testo Promemoria</Label>
            <p className="text-sm text-gray-600 mb-2">
              Personalizza il messaggio che apparirà nel promemoria
            </p>
            {isEditingText ? (
              <div className="space-y-2">
                <Input
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
                  placeholder="Inserisci il testo del promemoria"
                  disabled={!settings.enabled}
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={saveCustomText}
                    disabled={!settings.enabled}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Salva
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={cancelEditingText}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Annulla
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <p className="flex-1 text-sm">{settings.customText}</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={startEditingText}
                  disabled={!settings.enabled}
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Modifica
                </Button>
              </div>
            )}
          </div>

          {/* Browser Notifications */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Notifiche Browser</Label>
            <p className="text-sm text-gray-600 mb-2">
              Abilita le notifiche del browser per ricevere promemoria anche quando l'app è chiusa
            </p>
            <Button 
              variant="outline" 
              onClick={requestNotificationPermission}
              disabled={!settings.enabled}
            >
              <Bell className="h-4 w-4 mr-2" />
              Abilita Notifiche Browser
            </Button>
          </div>

          {/* Status Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium">Stato Attuale</h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Stato:</span>{' '}
                <span className={settings.enabled ? 'text-green-600' : 'text-gray-500'}>
                  {settings.enabled ? 'Attivo' : 'Disattivato'}
                </span>
              </p>
              {settings.enabled && (
                <p>
                  <span className="font-medium">Prossimo promemoria:</span>{' '}
                  <span className="text-blue-600">{settings.time}</span>
                </p>
              )}
              {settings.snoozedUntil && (
                <p>
                  <span className="font-medium">Snooze fino a:</span>{' '}
                  <span className="text-orange-600">
                    {new Date(settings.snoozedUntil).toLocaleTimeString('it-IT', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Come Funziona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p>L'app controllerà ogni minuto se è l'ora del promemoria</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p>Quando è l'ora, apparirà un alert con il tuo messaggio personalizzato</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p>"Snooze" rimanda il promemoria di 15 minuti</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p>Riceverai solo un promemoria al giorno per orario impostato</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p>Puoi personalizzare il testo del promemoria usando il pulsante "Modifica"</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}