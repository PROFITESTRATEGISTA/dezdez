import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, FileText, Shield, Calendar } from 'lucide-react';
import BeneficiaryManager from './BeneficiaryManager';
import OptionalServices from './OptionalServices';
import CheckoutSummary from './CheckoutSummary';
import { CheckoutData, Beneficiary, BillingPeriod } from '../types';
import { calculateTotal } from '../utils/pricing';
import { optionals } from '../data/plans';

interface CheckoutCalculatorProps {
  billingPeriod: BillingPeriod;
  onBack: () => void;
  onProceedToPayment: (data: CheckoutData) => void;
  existingData?: CheckoutData | null;
  onBillingPeriodChange?: (period: BillingPeriod) => void;
  leadData: { name: string; email: string; phone: string } | null;
}

const CheckoutCalculator: React.FC<CheckoutCalculatorProps> = ({
  billingPeriod,
  onBack,
  onProceedToPayment,
  existingData,
  onBillingPeriodChange,
  leadData,
}) => {
  const [userData, setUserData] = useState<{
    name: string;
    age: number;
    email: string;
    phone: string;
  } | null>(null);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedOptionals, setSelectedOptionals] = useState<string[]>([]);
  const [ageInput, setAgeInput] = useState('');

  // Inicializar com dados do lead
  useEffect(() => {
    if (leadData && !userData) {
      // Usar dados do lead como base, idade padrão será definida pelo usuário
      setUserData({
        name: leadData.name,
        age: 30, // Idade padrão, será atualizada pelo usuário
        email: leadData.email,
        phone: leadData.phone
      });
      setAgeInput('30');
    }
  }, [leadData, userData]);

  // Restaurar dados existentes se disponíveis
  useEffect(() => {
    if (existingData) {
      setUserData(existingData.mainUser);
      setBeneficiaries(existingData.beneficiaries);
      setSelectedOptionals(existingData.selectedOptionals);
      setAgeInput(existingData.mainUser.age.toString());
    }
  }, [existingData]);

  const handleAgeChange = (age: string) => {
    setAgeInput(age);
    if (userData && age) {
      setUserData({
        ...userData,
        age: parseInt(age)
      });
    }
  };

  const handleSendEmail = () => {
    alert('Simulação enviada com sucesso para ' + userData?.email);
  };

  const handleProceedToPayment = () => {
    if (!userData) return;

    const selectedOptionalsPrices = selectedOptionals.map(id => {
      const optional = optionals.find(o => o.id === id);
      return optional ? optional.price : 0;
    });

    const totalAmount = calculateTotal(
      userData.age,
      beneficiaries.map(b => b.age),
      selectedOptionalsPrices,
      billingPeriod,
      false
    );

    const checkoutData: CheckoutData = {
      mainUser: userData,
      beneficiaries,
      selectedPlan: 'dez-emergencias',
      billingPeriod,
      selectedOptionals,
      totalAmount,
      autoDebit: false
    };

    onProceedToPayment(checkoutData);
  };

  const totalLives = userData ? 1 + beneficiaries.length : 1;

  const billingOptions = [
    { key: 'monthly' as BillingPeriod, label: 'Mensal', discount: '' },
    { key: 'annual' as BillingPeriod, label: 'Anual', discount: '15% OFF' },
    { key: 'biannual' as BillingPeriod, label: 'Bianual', discount: '30% OFF' }
  ];

  // Função para gerar o texto correto dos opcionais
  const getOptionalsText = (count: number) => {
    if (count === 0) {
      return 'Nenhum serviço opcional';
    } else if (count === 1) {
      return '1 serviço opcional';
    } else {
      return `${count} serviços opcionais`;
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-900 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </button>

          {/* Resumo rápido no header */}
          <div className="flex items-center space-x-6 bg-white rounded-lg px-4 py-2 shadow-sm">
            <div className="flex items-center space-x-2 text-sm">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{totalLives} vida{totalLives > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <FileText className="h-4 w-4 text-green-600" />
              <span className="font-medium">{getOptionalsText(selectedOptionals.length)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Produto Principal */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-900 text-white p-3 rounded-lg mr-4">
                  <Shield className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">Proteção Médica 24h</h3>
                  <p className="text-gray-600">Plano Dez Emergências - Atendimento completo</p>
                </div>
                
                {/* Campo de idade inline */}
                <div className="ml-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sua idade:
                  </label>
                  <input
                    type="number"
                    min="25"
                    max="120"
                    value={ageInput}
                    onChange={(e) => handleAgeChange(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                  />
                </div>
              </div>

              {/* Seletor de Modalidade de Pagamento */}
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center mb-3">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-gray-900">Escolha sua modalidade de pagamento:</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {billingOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => onBillingPeriodChange?.(option.key)}
                      className={`relative p-3 border-2 rounded-lg text-center transition-all ${
                        billingPeriod === option.key
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      {option.discount && (
                        <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {option.discount}
                        </div>
                      )}
                      <div className="font-medium">{option.label}</div>
                      {option.discount && (
                        <div className="text-xs text-green-600 mt-1">{option.discount}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Atendimento domiciliar 24h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Remoção em ambulância UTI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Mais de 40 emergências cobertas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Cobertura nacional</span>
                </div>
              </div>
            </div>

            <BeneficiaryManager
              beneficiaries={beneficiaries}
              onChange={setBeneficiaries}
            />
            
            <OptionalServices
              selectedOptionals={selectedOptionals}
              onChange={setSelectedOptionals}
              totalLives={totalLives}
            />
          </div>
          
          <div className="lg:col-span-1">
            <CheckoutSummary
              checkoutData={{
                mainUser: userData,
                beneficiaries,
                selectedPlan: 'dez-emergencias',
                billingPeriod,
                selectedOptionals,
                totalAmount: 0, // Will be calculated in component
                autoDebit: false
              }}
              billingPeriod={billingPeriod}
              onSendEmail={handleSendEmail}
              onProceedToPayment={handleProceedToPayment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCalculator;