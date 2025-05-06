import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ZodiacCardProps {
  sign: {
    name: string;
    englishName: string;
    symbol: string;
    prediction: string;
  };
  isActive?: boolean;
}

const ZodiacCard = ({ sign, isActive = false }: ZodiacCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className={`border ${isActive ? 'border-primary bg-primary-light/5' : 'border-gray-100'} 
          rounded-lg p-3 text-center cursor-pointer ${!isActive ? 'hover:border-primary hover:shadow-sm' : 'shadow-sm'} 
          transition-all`}
        onClick={() => setIsOpen(true)}
      >
        <div className="text-2xl mb-1">{sign.symbol}</div>
        <h4 className="font-medium text-sm">{sign.name} ({sign.englishName})</h4>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{sign.symbol}</span>
              <span>{sign.name} ({sign.englishName})</span>
            </DialogTitle>
            <DialogDescription>
              Today's prediction for {sign.name}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p>{sign.prediction}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ZodiacCard;
