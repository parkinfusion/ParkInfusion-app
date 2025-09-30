import { useState, useEffect } from 'react';
import { getUsageReports, getTherapyLogs } from '@/lib/storage';
import { UsageReport, TherapyLog } from '@/lib/types';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Download, Printer, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState<UsageReport[]>([]);
  const [monthlyDays, setMonthlyDays] = useState<{[key: string]: number}>({});
  const [therapyLogs, setTherapyLogs] = useState<TherapyLog[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const sortedReports = getUsageReports().sort((a, b) => b.month.localeCompare(a.month));
    setReports(sortedReports);
    
    // Calculate days of usage per month
    const logs = getTherapyLogs();
    setTherapyLogs(logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    
    const daysPerMonth: {[key: string]: number} = {};
    
    logs.forEach(log => {
      const date = new Date(log.date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      daysPerMonth[monthKey] = (daysPerMonth[monthKey] || 0) + 1;
    });
    
    setMonthlyDays(daysPerMonth);
  }, []);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('it-IT', { year: 'numeric', month: 'long' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const exportToCSV = () => {
    const headers = ['Mese', 'Giorni Utilizzo', 'Canule', 'Siringhe', 'Adattatori'];
    const csvContent = [
      headers.join(','),
      ...reports.map(report => [
        formatMonth(report.month),
        monthlyDays[report.month] || 0,
        report.canule,
        report.siringhe,
        report.adattatori
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parkinfusion-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportTherapyCalendar = () => {
    const headers = ['Data', 'Durata (ore)', 'Note'];
    const csvContent = [
      headers.join(','),
      ...therapyLogs.map(log => [
        formatDate(log.date),
        log.duration,
        log.notes || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calendario-terapie.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to be last (6)
  };

  const getTherapyForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return therapyLogs.find(log => log.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-14 border border-gray-200 bg-gray-50"></div>
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const therapy = getTherapyForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      
      days.push(
        <div
          key={day}
          className={`h-14 border border-gray-200 p-1 relative flex flex-col ${
            isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
          } ${
            therapy 
              ? therapy.type === 'duodopa-canula' 
                ? 'bg-purple-100 border-purple-300' 
                : 'bg-green-100 border-green-300'
              : ''
          }`}
        >
          <div className={`text-xs font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
            {day}
          </div>
          {therapy && (
            <div className="flex-1 flex items-center justify-center">
              <div className={`w-4 h-4 rounded-full ${
                therapy.type === 'duodopa-canula' ? 'bg-purple-500' : 'bg-green-500'
              }`}></div>
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-800">Report</h1>
          </div>
          <p className="text-gray-600">Utilizzo Mensile e Calendario Terapie</p>
        </div>

        {/* Tabs for different reports */}
        <Tabs defaultValue="usage" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="usage">Utilizzo Dispositivi</TabsTrigger>
            <TabsTrigger value="calendar">Calendario Terapie</TabsTrigger>
          </TabsList>

          {/* Usage Reports Tab */}
          <TabsContent value="usage" className="space-y-4">
            {/* Export Actions */}
            <div className="flex gap-2">
              <Button onClick={exportToCSV} variant="outline" className="flex-1">
                <Download size={16} className="mr-2" />
                Esporta CSV
              </Button>
              <Button onClick={printReport} variant="outline" className="flex-1">
                <Printer size={16} className="mr-2" />
                Stampa
              </Button>
            </div>

            {/* Reports by Month */}
            <div className="space-y-4">
              {reports.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-gray-500">
                      Nessun dato disponibile
                    </p>
                  </CardContent>
                </Card>
              ) : (
                reports.map((report) => (
                  <Card key={report.month}>
                    <CardHeader>
                      <CardTitle className="text-lg">{formatMonth(report.month)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-gray-600">Giorni di utilizzo:</span>
                          <span className="font-semibold">{monthlyDays[report.month] || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-gray-600">Canule utilizzate:</span>
                          <span className="font-semibold text-purple-600">{report.canule}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                          <span className="text-sm text-gray-600">Siringhe utilizzate:</span>
                          <span className="font-semibold text-green-600">{report.siringhe}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-gray-600">Adattatori utilizzati:</span>
                          <span className="font-semibold text-blue-600">{report.adattatori}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Therapy Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            {/* Export Actions */}
            <div className="flex gap-2">
              <Button onClick={exportTherapyCalendar} variant="outline" className="flex-1">
                <Download size={16} className="mr-2" />
                Esporta Calendario
              </Button>
              <Button onClick={printReport} variant="outline" className="flex-1">
                <Printer size={16} className="mr-2" />
                Stampa
              </Button>
            </div>

            {/* Calendar View */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-lg">
                    {currentMonth.toLocaleDateString('it-IT', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="space-y-2">
                  {/* Week day headers */}
                  <div className="grid grid-cols-7 gap-1">
                    {weekDays.map(day => (
                      <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-600 bg-gray-100 rounded">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-1">
                    {renderCalendarGrid()}
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-600 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span>Duodopa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span>Duodopa + Canula</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
                      <span>Oggi</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Therapy Sessions List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Terapie Recenti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {therapyLogs.length === 0 ? (
                    <div className="text-center py-4">
                      <Calendar className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Nessuna terapia registrata</p>
                    </div>
                  ) : (
                    therapyLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${
                            log.type === 'duodopa-canula' ? 'bg-purple-500' : 'bg-green-500'
                          }`}></div>
                          <div>
                            <p className="font-medium text-sm">
                              {new Date(log.date).toLocaleDateString('it-IT', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short'
                              })}
                            </p>
                            <p className="text-xs text-gray-600">
                              {log.type === 'duodopa' ? 'Duodopa' : 'Duodopa + Canula'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {log.duration}h
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Navigation />
    </div>
  );
}