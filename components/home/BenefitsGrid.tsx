import React from 'react';
import { Shield, Heart, Users, Clock, Phone, CheckCircle } from 'lucide-react';

const BenefitsGrid: React.FC = () => {
  const benefits = [
    { icon: Phone, title: 'Orientação Médica 24h', description: 'Central médica disponível 24 horas por dia' },
    { icon: Shield, title: 'Remoção em Ambulância UTI', description: 'Ambulância equipada com UTI móvel' },
    { icon: Heart, title: 'Atendimento Domiciliar', description: 'Médico vai até sua casa para atendimento' },
    { icon: Users, title: 'Mais de 40 Emergências', description: 'Cobertura completa para diversos tipos' },
    { icon: Clock, title: 'Cobertura São Paulo e Grande SP', description: 'Atendimento em SP e região metropolitana' },
    { icon: CheckCircle, title: 'Proteção Familiar', description: 'Plano pode incluir cônjuge e filhos' }
  ];

  return (
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
          {benefits.map((benefit, index) => {
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
    </section>
  );
};

export default BenefitsGrid;