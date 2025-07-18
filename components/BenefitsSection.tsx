import React, { useState } from 'react';
import { Shield, Heart, Phone, Clock, Ambulance, Stethoscope, Users, MapPin, CheckCircle, Calculator } from 'lucide-react';
import { formatCurrency, getPriceByAge, BASE_PRICE } from '../utils/pricing';

const BenefitsSection: React.FC = () => {
  const [selectedAge, setSelectedAge] = useState(30);
  const [showSimulation, setShowSimulation] = useState(false);

  const emergencyTypes = [
    'Infarto agudo do miocárdio',
    'Acidente vascular cerebral (AVC)',
    'Crise hipertensiva',
    'Crise asmática grave',
    'Convulsões',
    'Traumatismo craniano',
    'Fraturas expostas',
    'Hemorragias graves',
    'Intoxicação aguda',
    'Queimaduras graves',
    'Cólica renal',
    'Apendicite aguda',
    'Pneumonia grave',
    'Edema agudo de pulmão',
    'Choque anafilático',
    'Desmaios e síncopes',
    'Dores torácicas intensas',
    'Abdome agudo',
    'Politraumatismo',
    'Emergências obstétricas',
    'Crises diabéticas',
    'Emergências psiquiátricas',
    'Picadas de animais peçonhentos',
    'Afogamento',
    'Parada cardiorrespiratória',
    'Emergências pediátricas',
    'Crise de pânico severa',
    'Overdose medicamentosa',
    'Emergências geriátricas',
    'Acidentes domésticos graves',
    'Emergências neurológicas',
    'Crises epilépticas',
    'Emergências urológicas',
    'Emergências oftalmológicas',
    'Emergências otorrinolaringológicas',
    'Emergências dermatológicas graves',
    'Emergências ortopédicas',
    'Emergências vasculares',
    'Emergências respiratórias',
    'Outras emergências médicas'
  ];

  const mainBenefits = [
    {
      icon: Phone,
      title: 'Orientação Médica 24h',
      description: 'Central médica disponível 24 horas por dia, 7 dias por semana para orientações e triagem'
    },
    {
      icon: Ambulance,
      title: 'Remoção em Ambulância UTI',
      description: 'Ambulância equipada com UTI móvel e equipe médica especializada'
    },
    {
      icon: Stethoscope,
      title: 'Atendimento Domiciliar',
      description: 'Médico vai até sua casa para atendimento de urgência e emergência'
    },
    {
      icon: Heart,
      title: 'Mais de 40 Emergências',
      description: 'Cobertura completa para diversos tipos de emergências médicas'
    },
    {
      icon: MapPin,
      title: 'Cobertura São Paulo e Grande SP',
      description: 'Atendimento em São Paulo capital e região metropolitana'
    },
    {
      icon: Users,
      title: 'Proteção Familiar',
      description: 'Plano pode incluir cônjuge, filhos e dependentes'
    }
  ];

  const handleSimulation = () => {
    setShowSimulation(true);
  };

  const monthlyPrice = getPriceByAge(selectedAge);

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Planos <span className="text-blue-900">a partir de R$ 59,90</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nossa equipe médica especializada resolve 90% das emergências no local, 
            sem necessidade de hospitalização, com atendimento 24h em São Paulo e Grande SP
          </p>
        </div>

        {/* Simulador Prático */}
        <div className="bg-gradient-to-br from-blue-900 to-green-700 rounded-2xl p-8 mb-12 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-2xl font-bold mb-2">Simulador de Preço por Idade</h3>
              <p className="text-blue-200">Descubra quanto custa sua proteção médica em São Paulo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <label className="block text-lg font-semibold mb-4">
                  Selecione sua idade:
                </label>
                <div className="flex items-center space-x-4 mb-6">
                  <input
                    type="range"
                    min="25"
                    max="80"
                    value={selectedAge}
                    onChange={(e) => setSelectedAge(parseInt(e.target.value))}
                    className="flex-1 h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="bg-white text-blue-900 px-4 py-2 rounded-lg font-bold text-xl min-w-[80px] text-center">
                    {selectedAge}
                  </div>
                </div>
                
                <button
                  onClick={handleSimulation}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Ver Simulação Completa
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-center">
                  <div className="text-sm text-blue-200 mb-2">Seu plano mensal em SP:</div>
                  <div className="text-4xl font-bold mb-4">{formatCurrency(59.90)}</div>
                  <div className="text-blue-200 text-sm mb-4">por mês</div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Plano Anual (15% OFF):</span>
                      <span className="font-semibold">{formatCurrency(50.92)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plano Bianual (30% OFF):</span>
                      <span className="font-semibold">{formatCurrency(41.93)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {showSimulation && (
              <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-xl font-bold mb-4">💰 Simulação Completa - {selectedAge} anos</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="font-semibold mb-2">Mensal</div>
                    <div className="text-2xl font-bold">{formatCurrency(59.90)}</div>
                    <div className="text-blue-200">por mês</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="font-semibold mb-2">Anual (15% OFF)</div>
                    <div className="text-2xl font-bold">{formatCurrency(50.92)}</div>
                    <div className="text-blue-200">por mês</div>
                    <div className="text-green-300 text-xs mt-1">+5% OFF no débito</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="font-semibold mb-2">Bianual (30% OFF)</div>
                    <div className="text-2xl font-bold">{formatCurrency(41.93)}</div>
                    <div className="text-blue-200">por mês</div>
                    <div className="text-green-300 text-xs mt-1">+5% OFF no débito</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Principais Benefícios */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Principais Benefícios do Plano
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="bg-blue-900 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lista Completa de Emergências */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-blue-900 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Mais de 40 Emergências Cobertas
            </h3>
            <p className="text-gray-600 mb-6">
              Lista completa de situações de emergência atendidas pelo plano em São Paulo
            </p>
            
            <button 
              id="toggle-emergencies-list-benefits"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium inline-flex items-center space-x-2"
              onClick={() => {
                const content = document.getElementById('emergencies-list-content-benefits');
                const preview = document.getElementById('emergencies-preview-benefits');
                const button = document.getElementById('toggle-emergencies-list-benefits');
                if (content && button && preview) {
                  const isHidden = content.classList.contains('hidden');
                  if (isHidden) {
                    content.classList.remove('hidden');
                    preview.classList.add('hidden');
                    button.textContent = 'Retrair Lista de Emergências';
                  } else {
                    content.classList.add('hidden');
                    preview.classList.remove('hidden');
                    button.textContent = 'Expandir Lista de Emergências';
                  }
                }
              }}
            >
              Expandir Lista de Emergências
            </button>
          </div>

          {/* Lista completa (inicialmente oculta) */}
          <div id="emergencies-list-content-benefits" className="hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {emergencyTypes.map((emergency, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{emergency}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Preview de emergências quando retraído */}
          <div id="emergencies-preview-benefits" className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {emergencyTypes.slice(0, 6).map((emergency, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{emergency}</span>
                </div>
            ))}
            <div className="flex items-center space-x-3 bg-blue-100 p-3 rounded-lg col-span-full">
              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <span className="text-blue-700 text-sm font-medium">
                E mais {emergencyTypes.length - 6} outras emergências cobertas...
              </span>
            </div>
          </div>
        </div>

        {/* Lista de Bairros Atendidos */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Principais Bairros Atendidos em São Paulo
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[
              'Brás', 'Mooca', 'Tatuapé', 'Vila Formosa', 'Penha',
              'Vila Matilde', 'Belém', 'Carrão', 'Vila Prudente', 'Sapopemba',
              'São Mateus', 'Vila Mariana', 'Ipiranga', 'Saúde', 'Cursino',
              'Vila Clementino', 'Jabaquara', 'Santo Amaro', 'Campo Belo', 'Brooklin',
              'Moema', 'Sé', 'República', 'Liberdade', 'Bela Vista',
              'Consolação', 'Santa Cecília', 'Bom Retiro', 'Cambuci', 'Aclimação'
            ].map((bairro, index) => (
              <div key={index} className="bg-blue-50 border border-blue-100 rounded-lg p-2 text-center hover:bg-blue-100 transition-colors">
                <span className="text-blue-900 text-sm font-medium">{bairro}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plano de Benefícios Adicional */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              🎁 Plano de Benefícios Exclusivo
            </h3>
            <p className="text-green-100 mb-6 text-lg">
              Descontos especiais em farmácias, laboratórios, clínicas e muito mais em São Paulo
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h4 className="font-semibold text-xl mb-4">Inclui:</h4>
                <ul className="space-y-2 text-green-100">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Descontos em farmácias (até 80%)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Laboratórios com preços especiais</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Clínicas e consultórios parceiros</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Rede odontológica com desconto</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Telemedicina incluída</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-center">
                  <div className="text-sm text-green-200 mb-2">Adicione por apenas:</div>
                  <div className="text-4xl font-bold mb-2">R$ 19,90</div>
                  <div className="text-green-200 text-sm mb-4">por mês</div>
                  <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                    Economia de até R$ 200/mês
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;