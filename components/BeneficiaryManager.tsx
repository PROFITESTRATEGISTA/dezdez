import React, { useState } from 'react';
import { useCallback } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import { Beneficiary } from '../types';
import { formatCurrency, getPriceByAge } from '../utils/pricing';

interface BeneficiaryManagerProps {
  beneficiaries: Beneficiary[];
  onChange: (beneficiaries: Beneficiary[]) => void;
}

const BeneficiaryManager: React.FC<BeneficiaryManagerProps> = ({
  beneficiaries,
  onChange
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: '',
    age: '',
    relationship: ''
  });

  const relationships = [
    'Cônjuge',
    'Filho(a)',
    'Pai',
    'Mãe',
    'Irmão(ã)',
    'Outro'
  ];

  const handleAdd = useCallback(() => {
    if (newBeneficiary.name && newBeneficiary.age && newBeneficiary.relationship) {
      const beneficiary: Beneficiary = {
        id: Date.now().toString(),
        name: newBeneficiary.name,
        age: parseInt(newBeneficiary.age),
        relationship: newBeneficiary.relationship
      };
      
      onChange([...beneficiaries, beneficiary]);
      setNewBeneficiary({ name: '', age: '', relationship: '' });
      setIsAdding(false);
    }
  }, [newBeneficiary, beneficiaries, onChange]);

  const handleRemove = useCallback((id: string) => {
    onChange(beneficiaries.filter(b => b.id !== id));
  }, [beneficiaries, onChange]);

  const totalBeneficiariesCost = beneficiaries.reduce((sum, b) => sum + getPriceByAge(b.age), 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-900" />
          Beneficiários
        </h3>
        
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar</span>
        </button>
      </div>

      {beneficiaries.length === 0 && !isAdding && (
        <p className="text-gray-500 text-center py-8">
          Nenhum beneficiário adicionado. Clique em "Adicionar" para incluir dependentes.
        </p>
      )}

      {beneficiaries.map((beneficiary) => (
        <div key={beneficiary.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3">
          <div>
            <h4 className="font-medium text-gray-900">{beneficiary.name}</h4>
            <p className="text-sm text-gray-600">
              {beneficiary.relationship} • {beneficiary.age} anos • {formatCurrency(getPriceByAge(beneficiary.age))}/mês
            </p>
          </div>
          
          <button
            onClick={() => handleRemove(beneficiary.id)}
            className="text-red-600 hover:text-red-800 p-2"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      {isAdding && (
        <div className="border border-gray-200 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Nome completo"
              value={newBeneficiary.name}
              onChange={(e) => setNewBeneficiary({ ...newBeneficiary, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            
            <input
              type="number"
              placeholder="Idade"
              min="0"
              max="120"
              value={newBeneficiary.age}
              onChange={(e) => setNewBeneficiary({ ...newBeneficiary, age: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            
            <select
              value={newBeneficiary.relationship}
              onChange={(e) => setNewBeneficiary({ ...newBeneficiary, relationship: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Parentesco</option>
              {relationships.map(rel => (
                <option key={rel} value={rel}>{rel}</option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Confirmar
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {beneficiaries.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Total beneficiários:</strong> {formatCurrency(totalBeneficiariesCost)}/mês
          </p>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryManager;