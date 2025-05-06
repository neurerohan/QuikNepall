import { ReactNode } from 'react';

interface MetalPriceProps {
  type: 'gold' | 'silver';
  prices: {
    label: string;
    value: string;
  }[];
  icon?: ReactNode;
}

const MetalPriceCard = ({ type, prices, icon }: MetalPriceProps) => {
  const bgColor = type === 'gold' ? 'bg-yellow-50' : 'bg-gray-50';
  const borderColor = type === 'gold' ? 'border-yellow-100' : 'border-gray-100';
  const iconColor = type === 'gold' ? 'text-yellow-600' : 'text-gray-600';
  const defaultIcon = type === 'gold' ? 'ri-copper-coin-line' : 'ri-coin-line';

  return (
    <div className={`${bgColor} rounded-lg p-4 border ${borderColor}`}>
      <div className="flex items-center mb-2">
        {icon || <i className={`${defaultIcon} ${iconColor} text-2xl mr-2`}></i>}
        <h4 className="font-medium">{type === 'gold' ? 'Gold' : 'Silver'}</h4>
      </div>
      <div className={`${prices.length > 1 ? 'flex justify-between mt-3' : 'mt-3'}`}>
        {prices.map((price, index) => (
          <div key={index} className={prices.length > 1 && index === 1 ? 'text-right' : ''}>
            <p className="text-sm text-gray-500">{price.label}</p>
            <p className="font-semibold">{price.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetalPriceCard;
