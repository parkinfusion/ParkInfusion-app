import { Link, useLocation } from 'react-router-dom';
import { Home, Package, BarChart3, Bell, User } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/inventory', icon: Package, label: 'Magazzino' },
    { path: '/reports', icon: BarChart3, label: 'Report' },
    { path: '/notifications', icon: Bell, label: 'Promemoria' },
    { path: '/account', icon: User, label: 'Account' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-500 hover:text-green-600'
              }`}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}