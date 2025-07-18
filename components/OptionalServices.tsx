import React from 'react';
import { useCallback } from 'react';
import { Video, Gift, Users } from 'lucide-react';
import { optionals } from '../data/plans';
import { formatCurrency } from '../utils/pricing';

interface OptionalServicesProps {
  selectedOptionals: string[];
  onChange: (optionals: string[]) => void;
  totalLives?: number;
}

const OptionalServices: React.FC<OptionalServicesProps> = ({
  selectedOptionals,
  onChange,
  totalLives = 1
}) => {
  // Pré-selecionar opcionais incluídos
  React.useEffect(() => {
    const includedOptionals = optionals
      .filter(opt => opt.included)
      .map(opt => opt.id);
    
    if (includedOptionals.length > 0) {
      const newSelected = [...new Set([...selectedOptionals, ...includedOptionals])];
      if (newSelected.length !== selectedOptionals.length) {
        onChange(newSelected);
      }
    }
  }, [selectedOptionals, onChange]);

  const handleToggle = useCallback((optionalId: string) => {
    // Não permitir desmarcar opcionais incluídos
    const isIncluded = optionals.find(opt => opt.id === optionalId)?.included;
    if (isIncluded) return;
    
    if (selectedOptionals.includes(optionalId)) {
      onChange(selectedOptionals.filter(id => id !== optionalId));
    } else {
      onChange([...selectedOptionals, optionalId]);
    }
  }, [selectedOptionals, onChange]);

  const getIcon = useCallback((id: string) => {
    switch (id) {
      case 'telemedicine':
        return <Video className="h-6 w-6" />;
      case 'benefits-club':
        return <Gift className="h-6 w-6" />;
      default:
        return <Gift className="h-6 w-6" />;
    }
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Serviços Opcionais</h3>
        {totalLives > 1 && (
          <div className="flex items-center space-x-2 text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
            <Users className="h-4 w-4" />
            <span>Aplicado para {totalLives} vida{totalLives > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {optionals.map((optional) => {
          const isSelected = selectedOptionals.includes(optional.id);
          const totalPrice = optional.free ? 0 : optional.price * totalLives;
          
          // Determinar se é um item incluído
          const isIncluded = optional.included === true;
          
          return (
            <div
              key={optional.id}
              onClick={() => handleToggle(optional.id)}
              className={`p-4 border-2 rounded-lg ${!isIncluded ? 'cursor-pointer' : ''} transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {getIcon(optional.id)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{optional.name}</h4>
                    <div className="text-right">
                      {optional.free ? (
                        <span className="text-green-600 font-semibold">GRÁTIS</span>
                      ) : (
                        <div>
                          <span className="text-blue-900 font-semibold">
                            {formatCurrency(totalPrice)}/mês
                          </span>
                          {totalLives > 1 && (
                            <div className="text-xs text-gray-500">
                              {formatCurrency(optional.price)} × {totalLives} vida{totalLives > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-1">{optional.description}</p>
                  
                  {totalLives > 1 && !optional.free && (
                    <div className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Aplicado para todas as {totalLives} vidas
                    </div>
                  )}
                  
                  {optional.free && !optional.included && (
                    <div className="mt-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Incluído gratuitamente
                    </div>
                  )}
                  
                  {optional.included && (
                    <div className="mt-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Incluído gratuitamente
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalLives > 1 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Users className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Opcionais aplicados para todas as vidas
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Os serviços opcionais selecionados serão aplicados automaticamente para o titular e todos os {totalLives - 1} beneficiário{totalLives - 1 > 1 ? 's' : ''}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionalServices;