import React from 'react';
import { Shield, Heart, Users, Clock, Phone, CheckCircle, ArrowRight, MapPin } from 'lucide-react';
import PlanSelector from './PlanSelector';
import BenefitsSection from './BenefitsSection';
import Breadcrumbs from './Breadcrumbs';
import { BillingPeriod } from '../types';

interface HomePageProps {
  selectedPeriod: BillingPeriod;
  onPeriodChange: (period: BillingPeriod) => void;
  onStartCheckout: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  selectedPeriod,
  onPeriodChange,
  onStartCheckout
}) => {
  const benefits = [
    'Mais de 40 ocorrências de emergência diferentes',
    'Atendimento domiciliar 24 horas',
    'Orientação médica por telefone',
    'Remoção em ambulância UTI',
    'Cobertura em São Paulo e Grande SP',
    'Equipe médica especializada'
  ];

  const idealFor = [
    { icon: Users, text: 'Famílias com crianças pequenas' },
    { icon: Heart, text: 'Idosos e pessoas da terceira idade' },
    { icon: Shield, text: 'Proteção de colaboradores' },
    { icon: Clock, text: 'Emergências 24h por dia' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <p>Planos <span className="text-blue-900">a partir de R$ 59,90/mês</span></p>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Proteção completa para sua família em São Paulo
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Plano de assistência médica de urgência e emergência 24h. 
                Sua família protegida com atendimento médico de qualidade em sua casa, resolvendo 90% das ocorrências sem necessidade de hospitalização.
              </p>
              
              {/* Cobertura São Paulo */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <MapPin className="h-6 w-6 text-blue-200" />
                  <h3 className="font-semibold text-lg">Cobertura São Paulo e Grande SP</h3>
                </div>
                <p className="text-blue-100 text-sm">
                  Atendimento médico em domicílio de alta qualidade na cidade de São Paulo e região metropolitana.
                  Nossa equipe médica especializada resolve 90% das emergências no local, sem necessidade de
                  deslocamento ao hospital.
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <img 
                    src="/image (1).png" 
                    alt="Dez Emergências" 
                    className="h-12 w-auto"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Dez Emergências</h3>
                  <p className="text-blue-200">A partir de R$ 59,90/mês</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Médico profissional em atendimento de emergência"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-blue-900 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 text-white p-2 rounded-full">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Proteção 24h em SP</p>
                    <p className="text-sm text-gray-600">Atendimento garantido</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa de Cobertura */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cobertura Exclusiva em São Paulo e Grande SP
            </h2>
            <p className="text-xl text-gray-600">
              Atendimento especializado na região metropolitana de São Paulo
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-blue-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-blue-900 mb-6">
                  🗺️ Área de Atendimento
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-600 text-white p-2 rounded-full">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">São Paulo Capital</h4>
                      <p className="text-blue-700 text-sm">
                        Todas as regiões da capital paulista com tempo de resposta otimizado
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-green-600 text-white p-2 rounded-full">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900">Grande São Paulo</h4>
                      <p className="text-green-700 text-sm">
                        ABC, Guarulhos, Osasco, Barueri e principais cidades da região metropolitana
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Simulação de mapa - em produção seria um mapa real */}
              <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-xl p-8 h-96 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-green-200/30"></div>
                
                {/* Pontos de atendimento simulados */}
                <div className="relative z-10 w-full h-full">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-blue-600 text-white p-4 rounded-full shadow-lg animate-pulse">
                      <MapPin className="h-8 w-8" />
                    </div>
                    <div className="text-center mt-2">
                      <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-blue-900 shadow">
                        São Paulo
                      </div>
                    </div>
                  </div>

                  {/* Pontos da Grande SP */}
                  <div className="absolute top-1/4 left-1/3">
                    <div className="bg-green-600 text-white p-2 rounded-full shadow animate-pulse">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="text-xs text-center mt-1 bg-white px-2 py-1 rounded shadow">ABC</div>
                  </div>

                  <div className="absolute top-1/3 right-1/4">
                    <div className="bg-green-600 text-white p-2 rounded-full shadow animate-pulse">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="text-xs text-center mt-1 bg-white px-2 py-1 rounded shadow">Guarulhos</div>
                  </div>

                  <div className="absolute bottom-1/3 left-1/4">
                    <div className="bg-green-600 text-white p-2 rounded-full shadow animate-pulse">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="text-xs text-center mt-1 bg-white px-2 py-1 rounded shadow">Osasco</div>
                  </div>

                  <div className="absolute bottom-1/4 right-1/3">
                    <div className="bg-green-600 text-white p-2 rounded-full shadow animate-pulse">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="text-xs text-center mt-1 bg-white px-2 py-1 rounded shadow">Barueri</div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Legenda:</div>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-xs text-gray-700">São Paulo Capital</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span className="text-xs text-gray-700">Grande São Paulo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Selector */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PlanSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={onPeriodChange}
          basePrice={59.90}
        />
        
        <div className="text-center">
          <button
            onClick={onStartCheckout}
            className="bg-blue-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors flex items-center space-x-2 mx-auto"
          >
            <span>Contratar Agora</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Benefits Section Completa */}
      <BenefitsSection />

      {/* Benefits Section Original */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Proteção completa quando você mais precisa
            </h2>
            <p className="text-xl text-gray-600">
              Mais de 40 ocorrências de emergência cobertas 24 horas por dia em São Paulo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ideal For Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ideal para quem você ama
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {idealFor.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-900 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <p className="text-gray-700 font-medium">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

   
      {/* Rede Hospitalar */}
      <section className="bg-white py-16 border-t border-gray-100" id="rede-hospitalar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Rede Hospitalar em São Paulo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Atendimento de qualidade em toda a região metropolitana
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Atendimento no Local</h3>
              <p className="text-gray-700">
                90% das emergências são resolvidas no local pela nossa equipe médica especializada, 
                sem necessidade de hospitalização.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-900 mb-4">Encaminhamento Hospitalar</h3>
              <p className="text-gray-700">
                Quando necessário, nossa equipe encaminha você ao hospital de sua preferência 
                ou ao mais adequado para seu caso.
              </p>
            </div>
          </div>
          
          {/* Hospitais Particulares Premium */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Hospitais Particulares Premium
                <span className="text-sm font-normal text-gray-500 ml-2">(20 unidades)</span>
              </h3>
              <button 
                id="toggle-premium-hospitals"
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center space-x-2"
                onClick={() => {
                  const content = document.getElementById('premium-hospitals-content');
                  const button = document.getElementById('toggle-premium-hospitals');
                  if (content && button) {
                    const isHidden = content.classList.contains('hidden');
                    if (isHidden) {
                      content.classList.remove('hidden');
                      button.textContent = 'Retrair Lista';
                    } else {
                      content.classList.add('hidden');
                      button.textContent = 'Expandir Lista';
                    }
                  }
                }}
              >
                Expandir Lista
              </button>
            </div>
            
            <div id="premium-hospitals-content" className="hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  "Hospital das Clínicas - HC FMUSP",
                  "Hospital Sírio-Libanês",
                  "Hospital Albert Einstein",
                  "Hospital Oswaldo Cruz",
                  "Hospital Santa Catarina",
                  "Hospital São Luiz",
                  "Hospital Beneficência Portuguesa",
                  "Hospital Alemão Oswaldo Cruz",
                  "Hospital Villa-Lobos",
                  "Hospital São Camilo",
                  "Hospital Samaritano",
                  "Hospital 9 de Julho",
                  "Hospital Bandeirantes",
                  "Hospital Santa Paula",
                  "Hospital São Rafael",
                  "Hospital Leforte",
                  "Hospital Moriah",
                  "Hospital Santa Joana",
                  "Hospital Pro Matre Paulista",
                  "Hospital e Maternidade Santa Joana"
                ].map((hospital, index) => (
                  <div key={index} className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="font-medium text-gray-900">{hospital}</div>
                    <div className="text-sm text-blue-600">Rede Particular</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Hospitais Particulares Populares */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Hospitais Particulares Populares
                <span className="text-sm font-normal text-gray-500 ml-2">(20 unidades)</span>
              </h3>
              <button 
                id="toggle-popular-hospitals"
                className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center space-x-2"
                onClick={() => {
                  const content = document.getElementById('popular-hospitals-content');
                  const button = document.getElementById('toggle-popular-hospitals');
                  if (content && button) {
                    const isHidden = content.classList.contains('hidden');
                    if (isHidden) {
                      content.classList.remove('hidden');
                      button.textContent = 'Retrair Lista';
                    } else {
                      content.classList.add('hidden');
                      button.textContent = 'Expandir Lista';
                    }
                  }
                }}
              >
                Expandir Lista
              </button>
            </div>
            
            <div id="popular-hospitals-content" className="hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  "Hospital Brasil - Rede D'Or",
                  "Hospital Bartira",
                  "Hospital Stella Maris",
                  "Hospital São Cristóvão",
                  "Hospital Nipo-Brasileiro",
                  "Hospital Santa Virgínia",
                  "Hospital São Paulo",
                  "Hospital Metropolitano",
                  "Hospital Santa Lucinda",
                  "Hospital Sancta Maggiore",
                  "Hospital Santa Helena",
                  "Hospital São José",
                  "Hospital Vitória",
                  "Hospital Regional do Brás",
                  "Hospital Santa Cruz",
                  "Hospital São Vicente",
                  "Hospital Regional de Osasco",
                  "Hospital Municipal de Barueri",
                  "Hospital Geral de Guarulhos",
                  "Hospital Regional do ABC"
                ].map((hospital, index) => (
                  <div key={index} className="bg-white border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="font-medium text-gray-900">{hospital}</div>
                    <div className="text-sm text-green-600">Rede Popular</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Hospitais Públicos e SUS */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Hospitais Públicos e SUS
                <span className="text-sm font-normal text-gray-500 ml-2">(20 unidades)</span>
              </h3>
              <button 
                id="toggle-public-hospitals"
                className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium flex items-center space-x-2"
                onClick={() => {
                  const content = document.getElementById('public-hospitals-content');
                  const button = document.getElementById('toggle-public-hospitals');
                  if (content && button) {
                    const isHidden = content.classList.contains('hidden');
                    if (isHidden) {
                      content.classList.remove('hidden');
                      button.textContent = 'Retrair Lista';
                    } else {
                      content.classList.add('hidden');
                      button.textContent = 'Expandir Lista';
                    }
                  }
                }}
              >
                Expandir Lista
              </button>
            </div>
            
            <div id="public-hospitals-content" className="hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  "Hospital Municipal Dr. Arthur Ribeiro de Saboya",
                  "Hospital Municipal do Tatuapé",
                  "Hospital Municipal Tide Setúbal",
                  "Hospital Municipal Prof. Mário Degni",
                  "Hospital Municipal Infantil Menino Jesus",
                  "Hospital Municipal Dr. José Soares Hungria",
                  "Hospital Municipal Vereador José Storopolli",
                  "Hospital Municipal Dr. Fernando Mauro Pires da Rocha",
                  "Hospital Municipal Dr. Ignácio Proença de Gouvêa",
                  "Hospital Municipal Dr. Moyses Deutsch",
                  "Hospital Municipal Doutor Carmino Caricchio",
                  "Hospital Municipal Vila Santa Catarina",
                  "Hospital Municipal Cidade Tiradentes",
                  "Hospital Municipal do Campo Limpo",
                  "Hospital Municipal M'Boi Mirim",
                  "Hospital Municipal Dr. Benedito Montenegro",
                  "Hospital Municipal Doutor Alexandre Zaio",
                  "Hospital Municipal Dr. Waldomiro de Paula",
                  "Hospital Municipal Doutor José Pangella",
                  "Hospital Municipal Doutor Alípio Corrêa Netto"
                ].map((hospital, index) => (
                  <div key={index} className="bg-white border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="font-medium text-gray-900">{hospital}</div>
                    <div className="text-sm text-purple-600">Atendimento SUS</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* UPAs e Pronto Socorros */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                UPAs e Pronto Socorros 24h
                <span className="text-sm font-normal text-gray-500 ml-2">(12 unidades)</span>
              </h3>
              <button 
                id="toggle-emergency-units"
                className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center space-x-2"
                onClick={() => {
                  const content = document.getElementById('emergency-units-content');
                  const button = document.getElementById('toggle-emergency-units');
                  if (content && button) {
                    const isHidden = content.classList.contains('hidden');
                    if (isHidden) {
                      content.classList.remove('hidden');
                      button.textContent = 'Retrair Lista';
                    } else {
                      content.classList.add('hidden');
                      button.textContent = 'Expandir Lista';
                    }
                  }
                }}
              >
                Expandir Lista
              </button>
            </div>
            
            <div id="emergency-units-content" className="hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  "UPA Zona Leste - Vila Alpina",
                  "UPA Zona Sul - Jabaquara",
                  "UPA Centro - Sé",
                  "UPA Zona Norte - Vila Maria",
                  "Pronto Socorro Municipal - Brás",
                  "Pronto Socorro do Tatuapé",
                  "Pronto Socorro da Mooca",
                  "Pronto Socorro Vila Maria",
                  "Pronto Socorro Sapopemba",
                  "Pronto Socorro Campo Limpo",
                  "Pronto Socorro Cidade Ademar",
                  "Pronto Socorro Vila Prudente"
                ].map((hospital, index) => (
                  <div key={index} className="bg-white border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="font-medium text-gray-900">{hospital}</div>
                    <div className="text-sm text-red-600">Emergência 24h</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Não deixe sua família desprotegida em São Paulo
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Contrate agora e tenha tranquilidade em qualquer emergência na capital e Grande SP
          </p>
          
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Orientação 24h</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Cobertura SP</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" /> 
              <span>Atendimento imediato</span>
            </div>
          </div>
          
          <button
            onClick={onStartCheckout}
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Contratar Plano Dez Emergências
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;