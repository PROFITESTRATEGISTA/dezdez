import React, { useState } from 'react';
import { User, Calendar, Shield } from 'lucide-react';
import { getAgeRangeByAge, getPriceByAge, formatCurrency } from '../utils/pricing';

interface AgeVerificationProps {
  onVerificationComplete: (userData: { name: string; age: number; email: string; phone: string }) => void;
  initialLeadData?: { name: string; email: string; phone: string } | null;
}

const AgeVerification: React.FC<AgeVerificationProps> = ({ onVerificationComplete, initialLeadData }) => {
  const [formData, setFormData] = useState({
    name: initialLeadData?.name || '',
    age: '',
    email: initialLeadData?.email || '',
    phone: initialLeadData?.phone || ''
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Simula verificação de identidade (substitui integração ChatGPT)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const userData = {
      name: formData.name,
      age: parseInt(formData.age),
      email: formData.email,
      phone: formData.phone
    };
    
    onVerificationComplete(userData);
    setIsVerifying(false);
  };

  const currentAge = parseInt(formData.age) || 0;
  const priceForAge = currentAge >= 25 ? getPriceByAge(currentAge) : 0;
  const ageRange = currentAge >= 25 ? getAgeRangeByAge(currentAge) : '';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <Shield className="h-12 w-12 text-blue-900 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-gray-900">Verificação de Identidade</h2>
        <p className="text-gray-600 mt-2">
          Precisamos verificar seus dados para calcular o valor do seu plano
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 inline mr-2" />
            Nome Completo
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite seu nome completo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-2" />
            Idade
          </label>
          <input
            type="number"
            required
            min="18"
            max="120"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite sua idade"
          />
          
          {currentAge >= 25 && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Faixa etária:</strong> {ageRange}
              </p>
              <p className="text-sm text-blue-700">
                <strong>Valor mensal:</strong> {formatCurrency(priceForAge)}
              </p>
            </div>
          )}
          
          {currentAge > 0 && currentAge < 25 && (
            <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-700">
                Planos disponíveis a partir de 25 anos
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-mail
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="(11) 99999-9999"
          />
        </div>

        <button
          type="submit"
          disabled={isVerifying || currentAge < 25}
          className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isVerifying ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Verificando identidade...
            </>
          ) : (
            'Continuar'
          )}
        </button>
      </form>
    </div>
  );
};

export default AgeVerification;