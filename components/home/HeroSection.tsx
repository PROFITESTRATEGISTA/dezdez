import React from 'react';
import { Shield, CheckCircle, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onStartCheckout: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartCheckout }) => {
  return (
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
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <MapPin className="h-6 w-6 text-blue-200" />
                <h3 className="font-semibold text-lg">Cobertura São Paulo e Grande SP</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Atendimento médico em domicílio de alta qualidade na cidade de São Paulo e região metropolitana.
              </p>
            </div>
            
            <button
              onClick={onStartCheckout}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Contratar Agora
            </button>
          </div>
          
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Médico profissional em atendimento de emergência"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;