import { Product } from '@/lib/types';
import { adjustStock } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Package } from 'lucide-react';
import { useState } from 'react';
import EditProductDialog from './EditProductDialog';

interface InventoryCardProps {
  product: Product;
  onUpdate: () => void;
}

export default function InventoryCard({ product, onUpdate }: InventoryCardProps) {
  const [bulkAmount, setBulkAmount] = useState('');
  
  const isLowStock = product.stock <= product.minThreshold;

  const handleBulkAdd = () => {
    const amount = parseInt(bulkAmount);
    if (amount > 0) {
      adjustStock(product.id, amount);
      setBulkAmount('');
      onUpdate();
    }
  };

  const handleQuickAdjust = (change: number) => {
    adjustStock(product.id, change);
    onUpdate();
  };

  return (
    <Card className={`${isLowStock ? 'border-red-300 bg-red-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package size={20} className="text-blue-600" />
            {product.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isLowStock && (
              <Badge variant="destructive" className="text-xs">
                Scorte basse
              </Badge>
            )}
            <EditProductDialog product={product} onUpdate={onUpdate} />
          </div>
        </div>
        <p className="text-sm text-gray-600">Codice: {product.code}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Scorte totali:</span>
            <p className={`font-semibold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
              {product.stock} pz
            </p>
          </div>
          <div>
            <span className="text-gray-600">Soglia minima:</span>
            <p className="font-semibold">{product.minThreshold} pz</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Quantità"
              value={bulkAmount}
              onChange={(e) => setBulkAmount(e.target.value)}
              className="flex-1"
              min="1"
            />
            <Button onClick={handleBulkAdd} disabled={!bulkAmount || parseInt(bulkAmount) <= 0}>
              Carica
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAdjust(-1)}
              disabled={product.stock <= 0}
              className="flex items-center gap-1"
            >
              <Minus size={16} />
              -1
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAdjust(1)}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              +1
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}