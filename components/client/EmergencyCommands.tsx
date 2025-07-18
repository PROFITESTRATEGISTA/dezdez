import React from 'react';
import { Phone, Ambulance, Heart } from 'lucide-react';

const EmergencyCommands: React.FC = () => {
  return (
    <div className="bg-red-600 text-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white text-red-600 p-3 rounded-full">
            <Ambulance className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">EMERGÊNCIA MÉDICA</h2>
            <p className="text-red-100">Atendimento 24h</p>
          </div>
        </div>
        <button className="bg-white text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-50 transition-colors">
          LIGAR AGORA
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-red-700 rounded-lg p-3">
          <Phone className="h-5 w-5 mx-auto mb-1" />
          <div className="text-sm font-bold">-</div>
          <div className="text-xs">Central 24h</div>
        </div>
        <div className="bg-red-700 rounded-lg p-3">
          <Ambulance className="h-5 w-5 mx-auto mb-1" />
          <div className="text-sm font-bold">-</div>
          <div className="text-xs">UTI Móvel</div>
        </div>
        <div className="bg-red-700 rounded-lg p-3">
          <Heart className="h-5 w-5 mx-auto mb-1" />
          <div className="text-sm font-bold">-</div>
          <div className="text-xs">Médico em Casa</div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCommands;