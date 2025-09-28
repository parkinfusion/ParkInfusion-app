import { getTherapyLogs } from '@/lib/storage';
import { TherapyLog } from '@/lib/types';
import { Calendar as CalendarIcon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

interface CalendarProps {
  onUpdate?: () => void;
}

export default function Calendar({ onUpdate }: CalendarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const logs = getTherapyLogs();
  
  // Get days: tomorrow, today, yesterday, then 6 more days back
  const getDays = () => {
    const days = [];
    const today = new Date();
    
    // Tomorrow (top left)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    days.push(tomorrow);
    
    // Today (top center)
    days.push(new Date(today));
    
    // Yesterday (top right)
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    days.push(yesterday);
    
    // 6 more days back (bottom rows)
    for (let i = 2; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }
    
    return days;
  };

  const getLogForDate = (date: Date): TherapyLog | undefined => {
    const dateStr = date.toISOString().split('T')[0];
    return logs.find(log => log.date === dateStr);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('it-IT', { 
      weekday: 'long', 
      day: 'numeric',
      month: 'long'
    });
  };

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('it-IT', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (date: Date): boolean => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const deleteTherapyLog = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const logs = getTherapyLogs();
    const filteredLogs = logs.filter(log => log.date !== dateStr);
    localStorage.setItem('parkinfusion_therapy_logs', JSON.stringify(filteredLogs));
    if (onUpdate) onUpdate();
    setIsSettingsOpen(false);
  };

  const getProductsUsed = (log: TherapyLog) => {
    if (log.type === 'duodopa') {
      return { siringhe: 1, adattatori: 1, canule: 0 };
    } else {
      return { siringhe: 1, adattatori: 1, canule: 1 };
    }
  };

  const days = getDays();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} className="text-blue-600" />
          <h3 className="font-semibold text-gray-800">Calendario Terapie</h3>
        </div>
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Settings size={14} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Gestione Terapie</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {days.map((day) => {
                const log = getLogForDate(day);
                if (!log) return null;
                
                return (
                  <div key={day.toISOString()} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{formatDate(day)}</p>
                      <p className="text-sm text-gray-600">
                        {log.type === 'duodopa' ? 'Duodopa' : 'Duodopa + Canula'}
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteTherapyLog(day)}
                    >
                      Elimina
                    </Button>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-2">
        {/* Top row: Tomorrow, Today, Yesterday */}
        <div className="grid grid-cols-3 gap-2">
          {days.slice(0, 3).map((day, index) => {
            const log = getLogForDate(day);
            const isTodayDate = isToday(day);
            const isTomorrowDate = isTomorrow(day);
            
            let bgColor = 'border-gray-200 bg-white text-gray-500';
            
            if (log) {
              // Full color background when therapy is logged
              if (log.type === 'duodopa') {
                bgColor = 'bg-green-600 text-white border-green-600';
              } else {
                bgColor = 'bg-purple-600 text-white border-purple-600';
              }
            } else if (isTodayDate) {
              bgColor = 'border-blue-300 bg-blue-50 text-blue-600 font-medium';
            } else if (isTomorrowDate) {
              bgColor = 'border-green-300 bg-green-50 text-green-600 font-medium';
            }
            
            return (
              <div
                key={day.toISOString()}
                className={`p-2 rounded-lg border text-center h-20 flex flex-col justify-center ${bgColor}`}
              >
                <div className="text-xs leading-tight">
                  {formatDate(day)}
                </div>
                {log && (
                  <div className="mt-1 text-xs font-medium leading-tight">
                    {log.type === 'duodopa' ? 'Duodopa' : (
                      <div>
                        <div>Duodopa +</div>
                        <div>Canula</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Bottom rows: Past days with table format */}
        <div className="grid grid-cols-3 gap-2">
          {days.slice(3, 6).map((day) => {
            const log = getLogForDate(day);
            const products = log ? getProductsUsed(log) : null;
            
            let bgColor = 'border-gray-200 bg-white text-gray-500';
            
            if (log) {
              if (log.type === 'duodopa') {
                bgColor = 'bg-green-600 text-white border-green-600';
              } else {
                bgColor = 'bg-purple-600 text-white border-purple-600';
              }
            }
            
            return (
              <div
                key={day.toISOString()}
                className={`p-2 rounded-lg border text-center h-24 flex flex-col ${bgColor}`}
              >
                <div className="text-xs font-medium mb-1">
                  {formatShortDate(day)}
                </div>
                {products && (
                  <div className="text-xs space-y-0.5 flex-1">
                    <div className="flex justify-between">
                      <span>S:</span><span>{products.siringhe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>A:</span><span>{products.adattatori}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>C:</span><span>{products.canule}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Last row: 3 more past days */}
        <div className="grid grid-cols-3 gap-2">
          {days.slice(6, 9).map((day) => {
            const log = getLogForDate(day);
            const products = log ? getProductsUsed(log) : null;
            
            let bgColor = 'border-gray-200 bg-white text-gray-500';
            
            if (log) {
              if (log.type === 'duodopa') {
                bgColor = 'bg-green-600 text-white border-green-600';
              } else {
                bgColor = 'bg-purple-600 text-white border-purple-600';
              }
            }
            
            return (
              <div
                key={day.toISOString()}
                className={`p-2 rounded-lg border text-center h-24 flex flex-col ${bgColor}`}
              >
                <div className="text-xs font-medium mb-1">
                  {formatShortDate(day)}
                </div>
                {products && (
                  <div className="text-xs space-y-0.5 flex-1">
                    <div className="flex justify-between">
                      <span>S:</span><span>{products.siringhe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>A:</span><span>{products.adattatori}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>C:</span><span>{products.canule}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}