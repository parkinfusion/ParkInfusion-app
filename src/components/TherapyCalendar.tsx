import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TherapyLog } from '@/lib/types';

interface TherapyCalendarProps {
  therapyLogs: TherapyLog[];
}

const MONTHS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

export default function TherapyCalendar({ therapyLogs }: TherapyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

  // Create therapy lookup by date
  const therapyByDate: { [key: string]: TherapyLog[] } = {};
  therapyLogs.forEach(log => {
    const logDate = new Date(log.date);
    if (logDate.getFullYear() === year && logDate.getMonth() === month) {
      const dateKey = logDate.getDate().toString();
      if (!therapyByDate[dateKey]) {
        therapyByDate[dateKey] = [];
      }
      therapyByDate[dateKey].push(log);
    }
  });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square p-1">
          <div className="w-full h-full"></div>
        </div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      const therapies = therapyByDate[day.toString()] || [];
      const hasTherapy = therapies.length > 0;

      days.push(
        <div key={day} className="aspect-square p-1">
          <div className={`
            w-full h-full rounded-lg border-2 p-2 relative
            ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
            ${hasTherapy ? 'bg-green-50 border-green-300' : ''}
          `}>
            <div className={`
              text-sm font-medium
              ${isToday ? 'text-blue-700' : hasTherapy ? 'text-green-700' : 'text-gray-700'}
            `}>
              {day}
            </div>
            
            {hasTherapy && (
              <div className="absolute bottom-1 left-1 right-1">
                {therapies.map((therapy, index) => (
                  <div key={index} className="flex items-center gap-1 mb-1">
                    <div className={`
                      w-2 h-2 rounded-full
                      ${therapy.type === 'duodopa-canula' ? 'bg-purple-500' : 'bg-green-500'}
                    `}></div>
                    <span className="text-xs text-gray-600 truncate">
                      {therapy.duration}h
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendario Terapie
          </CardTitle>
          <Button onClick={goToToday} variant="outline" size="sm">
            Oggi
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <Button onClick={goToPreviousMonth} variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-lg font-semibold">
            {MONTHS[month]} {year}
          </h3>
          
          <Button onClick={goToNextMonth} variant="ghost" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded border-2 border-blue-500 bg-blue-50"></div>
            <span>Oggi</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Duodopa</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span>Duodopa + Canula</span>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>

        {/* Monthly summary */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Riepilogo {MONTHS[month]}</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-600">Giorni con terapia:</span>
              <span className="font-semibold ml-1">
                {Object.keys(therapyByDate).length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Totale terapie:</span>
              <span className="font-semibold ml-1">
                {Object.values(therapyByDate).flat().length}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}