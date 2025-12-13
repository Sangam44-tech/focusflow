// frontend/src/features/subscription/components/PricingCard.jsx
import { CheckIcon } from '@heroicons/react/24/solid';
import { Button } from '../../../components/common/Button';

export const PricingCard = ({
  name,
  price,
  period = 'month',
  features,
  isCurrentPlan,
  isPopular,
  onSelect,
  loading,
  buttonText = 'Get Started',
}) => {
  return (
    <div
      className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all ${
        isPopular ? 'border-primary-500 scale-105' : 'border-gray-200'
      } ${isCurrentPlan ? 'ring-2 ring-primary-500' : ''}`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary-500 text-white text-sm font-medium px-4 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-green-500 text-white text-sm font-medium px-4 py-1 rounded-full">
            Current Plan
          </span>
        </div>
      )}

      <div className="p-8">
        {/* Plan Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>

        {/* Price */}
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">${price}</span>
          {price > 0 && (
            <span className="text-gray-500">/{period}</span>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          variant={isPopular ? 'primary' : 'outline'}
          className="w-full"
          onClick={onSelect}
          loading={loading}
          disabled={isCurrentPlan || loading}
        >
          {isCurrentPlan ? 'Current Plan' : buttonText}
        </Button>
      </div>
    </div>
  );
};