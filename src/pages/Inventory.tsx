import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/storage';
import { Product } from '@/lib/types';
import Navigation from '@/components/Navigation';
import InventoryCard from '@/components/InventoryCard';
import { Package } from 'lucide-react';

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = () => {
    setProducts(getProducts());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-800">Magazzino</h1>
          </div>
          <p className="text-gray-600">Gestione Scorte Dispositivi</p>
        </div>

        {/* Products */}
        <div className="space-y-4">
          {products.map((product) => (
            <InventoryCard
              key={product.id}
              product={product}
              onUpdate={loadProducts}
            />
          ))}
        </div>
      </div>
      
      <Navigation />
    </div>
  );
}