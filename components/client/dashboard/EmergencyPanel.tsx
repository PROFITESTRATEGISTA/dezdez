import React, { useState } from 'react';
import { Phone, Ambulance, Heart } from 'lucide-react';

const EmergencyPanel: React.FC = () => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  
  const handleEmergencyCall = () => {
    // In a real app, this would trigger a call or show emergency contact info
    setIsCallModalOpen(true);
    
    // For demo purposes, just show an alert after a delay
    setTimeout(() => {
      window.open('tel:0800-123-4567', '_self');
      setIsCallModalOpen(false);
    }, 2000);
  };

  return (
    <div className="bg-red-600 text-white rounded-xl p-4 sm:p-6 shadow-lg">
      <div className="flex flex-col items-center justify-between gap-4">
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="bg-white text-red-600 p-3 rounded-full">
            <Ambulance className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">EMERGÊNCIA MÉDICA</h2>
            <p className="text-red-100">Atendimento 24h em sua casa</p>
          </div>
        </div>
        <button 
          className="w-full bg-white text-red-600 px-4 py-3 rounded-lg font-bold text-lg hover:bg-red-50 transition-colors"
          onClick={handleEmergencyCall}
        >
          {isCallModalOpen ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 mr-2"></div>
              CONECTANDO...
            </div>
          ) : (
            'LIGAR AGORA'
          )}
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="bg-red-700 rounded-lg p-3">
          <Phone className="h-5 w-5 mx-auto mb-1" />
          <div className="text-sm font-bold">0800-123-4567</div>
          <div className="text-xs">Central 24h</div>
        </div>
        <div className="bg-red-700 rounded-lg p-3">
          <Ambulance className="h-5 w-5 mx-auto mb-1" />
          <div className="text-sm font-bold">15 min</div>
          <div className="text-xs">UTI Móvel</div>
        </div>
        <div className="bg-red-700 rounded-lg p-3">
          <Heart className="h-5 w-5 mx-auto mb-1" />
          <div className="text-sm font-bold">90%</div>
          <div className="text-xs">Resolvido no local</div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPanel;