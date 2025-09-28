import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FlaskConical, AlertTriangle } from 'lucide-react';
import { login, register } from '@/lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let result;
      if (isRegisterMode) {
        result = await register(email, password, displayName);
      } else {
        result = await login(email, password);
      }

      if (result.success) {
        window.location.reload(); // Ricarica per aggiornare lo stato di autenticazione
      } else {
        setError(result.error || 'Errore durante l\'operazione');
      }
    } catch (err) {
      setError('Errore durante l\'operazione');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <FlaskConical size={48} className="text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">ParkInfusion</CardTitle>
          <p className="text-gray-600">
            {isRegisterMode ? 'Registra Nuovo Account' : 'Accesso alla Gestione Terapia'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-300 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            {isRegisterMode && (
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
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mario.rossi@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Inserisci la password"
                required
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading 
                ? (isRegisterMode ? 'Registrazione...' : 'Accesso in corso...') 
                : (isRegisterMode ? 'Registrati' : 'Accedi')
              }
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError('');
                setEmail('');
                setPassword('');
                setDisplayName('');
              }}
              className="text-green-600 hover:text-green-700"
            >
              {isRegisterMode 
                ? 'Hai già un account? Accedi' 
                : 'Non hai un account? Registrati'
              }
            </Button>
          </div>
          
          {!isRegisterMode && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-2">Per iniziare:</p>
              <p className="text-xs text-blue-700">
                Clicca su "Non hai un account? Registrati" per creare il tuo account personale con email e password.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}