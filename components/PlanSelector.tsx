import React from 'react';
import { BillingPeriod } from '../types';

interface PlanSelectorProps {
  selectedPeriod: BillingPeriod;
  onPeriodChange: (period: BillingPeriod) => void;
  basePrice?: number;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  basePrice = 59.90
}) => {
  const periods = [
    { key: 'monthly' as BillingPeriod, label: 'Mensal', suffix: '/mês' },
    { key: 'annual' as BillingPeriod, label: 'Anual', suffix: '/ano', discount: '15% OFF' },
    { key: 'biannual' as BillingPeriod, label: 'Bianual', suffix: '/2 anos', discount: '30% OFF' }
  ];

  // Cálculo dos preços com desconto
  const annualPrice = (basePrice * 0.85).toFixed(2); // 15% de desconto
  const biannualPrice = (basePrice * 0.7).toFixed(2); // 30% de desconto
  
  // Cálculo das economias
  const annualSavings = (basePrice * 0.15).toFixed(2); // 15% de economia
  const biannualSavings = (basePrice * 0.3).toFixed(2); // 30% de economia

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Planos <span className="text-blue-900">a partir de R$ 59,90</span>
        </h3>
        <p className="text-gray-600">Proteção de urgência e emergência 24h</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Plano Mensal */}
        <div
          onClick={() => onPeriodChange('monthly')}
          className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
            selectedPeriod === 'monthly'
              ? 'border-blue-600 bg-blue-50 shadow-lg'
              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
          }`}
        >
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 text-lg mb-2">Mensal</h4>
            <div className="mb-3">
              <span className="text-3xl font-bold text-blue-900">
                R$ 59,90
              </span>
              <span className="text-sm text-gray-600 block">
                /mês • Cartão de crédito
              </span>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <div className="font-semibold text-blue-800 mb-1">
                💳 Pagamento Mensal
              </div>
              <div className="text-xs text-blue-600">
                Apenas cartão de crédito
              </div>
            </div>
          </div>
        </div>

        {/* Plano Anual */}
        <div
          onClick={() => onPeriodChange('annual')}
          className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
            selectedPeriod === 'annual'
              ? 'border-blue-600 bg-blue-50 shadow-lg'
              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
          }`}
        >
          <div className="absolute -top-3 -right-3 bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
            15% OFF
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 text-lg mb-2">Anual</h4>
            <div className="mb-3">
              <span className="text-3xl font-bold text-blue-900">
                R$ 50,92
              </span>
              <span className="text-sm text-gray-600 block">
                /ano
              </span>
            </div>
            
            <div className="text-sm text-green-600 font-medium mb-2">
              Economize R$ 8,99
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm mb-3">
              <div className="text-xs text-yellow-600 mt-1">
                🔥 PIX disponível para pagamento à vista
              </div>
            </div>
          </div>
        </div>

        {/* Plano Bianual */}
        <div
          onClick={() => onPeriodChange('biannual')}
          className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
            selectedPeriod === 'biannual'
              ? 'border-blue-600 bg-blue-50 shadow-lg'
              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
          }`}
        >
          <div className="absolute -top-3 -right-3 bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
            30% OFF
          </div>
          
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 text-lg mb-2">Bianual</h4>
            <div className="mb-3">
              <span className="text-3xl font-bold text-blue-900">
                R$ 41,93
              </span>
              <span className="text-sm text-gray-600 block">
                /2 anos
              </span>
            </div>
            
            <div className="text-sm text-green-600 font-medium mb-2">
              Economize R$ 17,97
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm mb-3">
              <div className="text-xs text-yellow-600 mt-1">
                🔥 PIX disponível para pagamento à vista
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-600 space-y-1">
        <p>Planos <span className="text-blue-900">a partir de R$ 59,90/mês</span></p>
        <p>💰 <strong>Planos Anuais:</strong> PIX disponível para pagamento à vista</p>
      </div>
    </div>
  );
};

export default PlanSelector;