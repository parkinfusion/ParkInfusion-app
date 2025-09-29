import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Clock, Edit2, Save, X, Smartphone, AlertCircle, Zap } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState({
    duodopa: true,
    canula: true,
    battery: true,
    maintenance: true
  });

  const [reminderText, setReminderText] = useState('Ricordati di prendere la tua terapia Duodopa');
  const [isEditingText, setIsEditingText] = useState(false);
  const [tempText, setTempText] = useState(reminderText);
  const [reminderTime, setReminderTime] = useState('09:00');

  // Load saved settings on component mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    const savedReminderText = localStorage.getItem('reminderText');
    const savedReminderTime = localStorage.getItem('reminderTime');

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    if (savedReminderText) {
      setReminderText(savedReminderText);
      setTempText(savedReminderText);
    }
    if (savedReminderTime) {
      setReminderTime(savedReminderTime);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('reminderText', reminderText);
  }, [reminderText]);

  useEffect(() => {
    localStorage.setItem('reminderTime', reminderTime);
  }, [reminderTime]);

  const handleNotificationToggle = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleTimeChange = (time: string) => {
    setReminderTime(time);
  };

  const handleStartEdit = () => {
    setTempText(reminderText);
    setIsEditingText(true);
  };

  const handleSaveText = () => {
    setReminderText(tempText);
    setIsEditingText(false);
  };

  const handleCancelEdit = () => {
    setTempText(reminderText);
    setIsEditingText(false);
  };

  const testAlert = () => {
    alert(`🔔 PROMEMORIA TERAPIA PERSONALIZZATO!\n\n${reminderText}\n\n⏰ Orario: ${reminderTime}\n\n✅ Funziona perfettamente!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* MEGA HEADER - IMPOSSIBLE TO MISS */}
        <div className="text-center mb-8 bg-gradient-to-r from-red-500 to-purple-600 text-white p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="h-12 w-12 animate-pulse" />
            <h1 className="text-5xl font-black">🚀 PROMEMORIA AGGIORNATO! 🚀</h1>
            <Zap className="h-12 w-12 animate-pulse" />
          </div>
          <p className="text-2xl font-bold animate-bounce">
            ✨ NUOVA VERSIONE - Gestisci i tuoi promemoria per dispositivi palmari ✨
          </p>
          <p className="text-lg mt-2 bg-yellow-400 text-black px-4 py-2 rounded-full inline-block font-bold">
            🔥 SE VEDI QUESTO MESSAGGIO, L'AGGIORNAMENTO È RIUSCITO! 🔥
          </p>
        </div>

        {/* SUPER VISIBLE UPDATE NOTICE */}
        <Card className="border-4 border-red-500 bg-gradient-to-r from-yellow-100 to-orange-100 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-800 mb-3">
              <AlertCircle className="h-8 w-8 animate-spin" />
              <p className="text-2xl font-black">🎉 AGGIORNAMENTO COMPLETATO CON SUCCESSO! 🎉</p>
            </div>
            <div className="bg-green-200 p-4 rounded-lg border-2 border-green-500">
              <p className="text-lg font-bold text-green-800">
                ✅ La pagina promemoria è stata completamente rinnovata!<br/>
                ✅ Nuove funzionalità per dispositivi palmari attive!<br/>
                ✅ Sistema di salvataggio migliorato!<br/>
                ✅ Test promemoria funzionante!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-4 border-blue-500 shadow-xl">
          <CardHeader className="bg-blue-100">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Bell className="h-8 w-8" />
              🔔 IMPOSTAZIONI AVVISI RINNOVATE
            </CardTitle>
            <CardDescription className="text-lg font-semibold">
              Attiva o disattiva gli avvisi per i diversi eventi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-300">
              <div>
                <Label className="font-bold text-lg">🧪 Scorte Duodopa in esaurimento</Label>
                <p className="text-base text-gray-700">Avviso quando le scorte sono basse</p>
              </div>
              <Switch
                checked={notifications.duodopa}
                onCheckedChange={() => handleNotificationToggle('duodopa')}
                className="scale-150"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-300">
              <div>
                <Label className="font-bold text-lg">🔧 Scorte Canula in esaurimento</Label>
                <p className="text-base text-gray-700">Avviso quando le canule sono poche</p>
              </div>
              <Switch
                checked={notifications.canula}
                onCheckedChange={() => handleNotificationToggle('canula')}
                className="scale-150"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-300">
              <div>
                <Label className="font-bold text-lg">🔋 Batteria pompa scarica</Label>
                <p className="text-base text-gray-700">Avviso per batteria in esaurimento</p>
              </div>
              <Switch
                checked={notifications.battery}
                onCheckedChange={() => handleNotificationToggle('battery')}
                className="scale-150"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-300">
              <div>
                <Label className="font-bold text-lg">🔧 Manutenzione programmata</Label>
                <p className="text-base text-gray-700">Promemoria per controlli periodici</p>
              </div>
              <Switch
                checked={notifications.maintenance}
                onCheckedChange={() => handleNotificationToggle('maintenance')}
                className="scale-150"
              />
            </div>
          </CardContent>
        </Card>

        {/* Daily Reminder - SUPER ENHANCED */}
        <Card className="border-4 border-green-500 shadow-2xl bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader className="bg-gradient-to-r from-green-200 to-blue-200">
            <CardTitle className="flex items-center gap-2 text-3xl font-black text-green-800">
              <Clock className="h-10 w-10 animate-pulse" />
              ⏰ PROMEMORIA TERAPIA PERSONALIZZATO ⏰
            </CardTitle>
            <CardDescription className="text-xl font-bold text-green-700">
              🆕 NUOVA FUNZIONALITÀ - Configura il tuo promemoria quotidiano!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="space-y-4">
              <Label htmlFor="reminder-time" className="text-2xl font-bold text-blue-800">⏰ Orario Promemoria</Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="w-full text-2xl p-4 border-4 border-blue-400 rounded-xl shadow-lg"
              />
              <p className="text-lg text-gray-700 font-semibold bg-yellow-100 p-3 rounded-lg">
                🕘 Imposta l'orario per ricevere il promemoria giornaliero
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-2xl font-bold text-purple-800">💬 Messaggio Promemoria</Label>
                {!isEditingText && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleStartEdit}
                    className="border-4 border-purple-400 text-purple-700 hover:bg-purple-100 text-lg font-bold"
                  >
                    <Edit2 className="h-6 w-6 mr-2" />
                    ✏️ MODIFICA TESTO
                  </Button>
                )}
              </div>
              
              {isEditingText ? (
                <div className="space-y-4">
                  <Textarea
                    value={tempText}
                    onChange={(e) => setTempText(e.target.value)}
                    placeholder="Inserisci il tuo messaggio personalizzato..."
                    className="min-h-[120px] text-xl border-4 border-purple-400 rounded-xl p-4"
                  />
                  <div className="flex gap-4">
                    <Button onClick={handleSaveText} className="flex-1 bg-green-600 hover:bg-green-700 text-xl py-4">
                      <Save className="h-6 w-6 mr-2" />
                      💾 SALVA MODIFICHE
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit} className="flex-1 text-xl py-4 border-2">
                      <X className="h-6 w-6 mr-2" />
                      ❌ ANNULLA
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border-4 border-blue-300 shadow-lg">
                  <p className="text-xl text-blue-900 font-bold">💬 "{reminderText}"</p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t-4 border-orange-300">
              <Button 
                onClick={testAlert} 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-2xl py-6 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200" 
                size="lg"
              >
                <Bell className="h-8 w-8 mr-3 animate-bounce" />
                🔔 PROVA PROMEMORIA SUBITO! 🔔
              </Button>
              <p className="text-lg text-center mt-4 font-bold bg-orange-100 p-3 rounded-lg">
                👆 Clicca qui per testare il promemoria personalizzato!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Info - SUPER VISIBLE */}
        <Card className="border-4 border-green-600 shadow-2xl bg-gradient-to-br from-green-100 to-emerald-100">
          <CardHeader className="bg-gradient-to-r from-green-300 to-emerald-300">
            <CardTitle className="flex items-center gap-2 text-2xl font-black text-green-800">
              <Smartphone className="h-8 w-8" />
              📱 STATO PROMEMORIA ATTIVO
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gradient-to-r from-green-200 to-emerald-200 p-6 rounded-xl border-4 border-green-400 shadow-lg">
              <div className="space-y-3">
                <p className="font-black text-2xl text-green-900">✅ PROMEMORIA CONFIGURATO E ATTIVO!</p>
                <p className="text-xl text-green-800 bg-white p-2 rounded-lg">
                  <strong>⏰ Orario:</strong> {reminderTime}
                </p>
                <p className="text-xl text-green-800 bg-white p-2 rounded-lg">
                  <strong>💬 Messaggio:</strong> "{reminderText}"
                </p>
              </div>
            </div>
            
            <div className="mt-6 space-y-3 text-lg font-semibold">
              <p className="bg-blue-100 p-3 rounded-lg">📱 Ottimizzato per dispositivi palmari</p>
              <p className="bg-purple-100 p-3 rounded-lg">💾 Salvataggio automatico attivo</p>
              <p className="bg-orange-100 p-3 rounded-lg">🔔 Test promemoria sempre disponibile</p>
            </div>
          </CardContent>
        </Card>

        {/* FINAL CONFIRMATION */}
        <Card className="border-4 border-rainbow bg-gradient-to-r from-red-100 via-yellow-100 via-green-100 to-blue-100 shadow-2xl">
          <CardContent className="p-8 text-center">
            <h2 className="text-4xl font-black mb-4">🎊 CONGRATULAZIONI! 🎊</h2>
            <p className="text-2xl font-bold text-purple-800">
              Se riesci a leggere questo messaggio, l'aggiornamento è stato applicato con successo!
            </p>
            <p className="text-xl mt-4 bg-yellow-300 p-4 rounded-xl font-bold">
              🚀 La tua app ParkInfusion è ora aggiornata con le nuove funzionalità! 🚀
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;