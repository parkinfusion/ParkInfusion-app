import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navigation from '@/components/Navigation';
import { logout, updateUserProfile } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { User, CheckCircle, AlertTriangle, LogOut } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function Account() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setEmail(user.email || '');
          setDisplayName(user.user_metadata?.display_name || '');
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };

    loadUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = await updateUserProfile({ display_name: displayName });
      
      if (result.success) {
        setMessage('Profilo aggiornato con successo!');
        setMessageType('success');
        
        // Refresh user data
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
        }
      } else {
        setMessage(result.error || 'Errore durante l\'aggiornamento');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Errore durante l\'aggiornamento del profilo');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento profilo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Account</h1>
          <p className="text-gray-600">Gestione Profilo Utente</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informazioni Profilo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {message && (
                <Alert className={messageType === 'success' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}>
                  {messageType === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={messageType === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-gray-500">L'email non può essere modificata</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Es. Mario Rossi"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? 'Aggiornamento...' : 'Aggiorna Profilo'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informazioni Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ID Utente:</span>
              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                {user.id.slice(0, 8)}...
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Account creato:</span>
              <span className="text-sm">
                {new Date(user.created_at).toLocaleDateString('it-IT')}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Disconnetti
        </Button>
      </div>
      
      <Navigation />
    </div>
  );
}