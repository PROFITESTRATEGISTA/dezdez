import React from 'react';
import { Video, Calendar } from 'lucide-react';

const ServicesPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Telemedicine */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex flex-col items-center mb-4 gap-3">
          <div className="bg-blue-600 text-white p-3 rounded-full mr-4">
            <Video className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900">Central de Telemedicina</h3>
        </div>
        <p className="text-blue-700 mb-4 text-sm">
          Conecte-se com médicos especialistas por videoconferência.
        </p>
        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Iniciar Teleconsulta
        </button>
      </div>

      {/* Dez Clinic */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex flex-col items-center mb-4 gap-3">
          <div className="bg-green-600 text-white p-3 rounded-full mr-4">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-green-900">Agendar Consulta</h3>
        </div>
        <p className="text-green-700 mb-4 text-sm">
          Agende consultas em nossas clínicas parceiras.
        </p>
        <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
          Agendar Consulta
        </button>
      </div>
    </div>
  );
};

export default ServicesPanel;