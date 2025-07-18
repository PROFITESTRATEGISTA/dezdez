import React, { useState } from 'react';
import { User, Mail, Phone, Shield, ArrowRight } from 'lucide-react';

interface LeadCollectionProps {
  onComplete: (leadData: { name: string; email: string; phone: string }) => void;
}

const LeadCollection: React.FC<LeadCollectionProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simula envio dos dados de lead
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(formData);
    setIsSubmitting(false);
  };

  const isFormValid = formData.name && formData.email && formData.phone;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-10 w-10 text-blue-900" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Proteja sua Família Agora
            </h1>
            <p className="text-gray-600">
              Preencha seus dados para começar a cotação do seu plano de emergências médicas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Digite seu nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                E-mail *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Telefone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">Seus dados estão seguros</p>
                  <p className="text-blue-700">
                    Utilizamos seus dados apenas para criar sua cotação personalizada. 
                    Não compartilhamos com terceiros.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-blue-900 text-white py-4 px-6 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-semibold"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : (
                <>
                  <span>Começar Cotação</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Ao continuar, você concorda com nossos termos de uso e política de privacidade.
            </p>
          </form>
        </div>

        {/* Benefits Preview */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-3 text-center">O que você terá:</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Atendimento 24h</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Ambulância UTI</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Médico em casa</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>40+ emergências</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCollection; 