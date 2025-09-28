import { useState } from 'react';
import { Product } from '@/lib/types';
import { updateProduct } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';

interface EditProductDialogProps {
  product: Product;
  onUpdate: () => void;
}

export default function EditProductDialog({ product, onUpdate }: EditProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    code: product.code,
    minThreshold: product.minThreshold.toString()
  });

  const handleSave = () => {
    const minThreshold = parseInt(formData.minThreshold);
    if (formData.name.trim() && formData.code.trim() && minThreshold >= 0) {
      updateProduct(product.id, {
        name: formData.name.trim(),
        code: formData.code.trim(),
        minThreshold: minThreshold
      });
      onUpdate();
      setIsOpen(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <Settings size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifica Prodotto</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome Prodotto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nome del prodotto"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="code">Codice Prodotto</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              placeholder="Codice del prodotto"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="minThreshold">Soglia Minima</Label>
            <Input
              id="minThreshold"
              type="number"
              min="0"
              value={formData.minThreshold}
              onChange={(e) => handleInputChange('minThreshold', e.target.value)}
              placeholder="Soglia minima"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Annulla
          </Button>
          <Button onClick={handleSave}>
            Salva
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}