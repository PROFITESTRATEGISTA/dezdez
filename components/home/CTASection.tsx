import React from 'react';
import { Phone, Shield, Clock } from 'lucide-react';

interface CTASectionProps {
  onStartCheckout: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStartCheckout }) => {
  return (
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
  );
};

export default CTASection;