import React from 'react';
import { MapPin } from 'lucide-react';

const CoverageMap: React.FC = () => {
  return (
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

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-yellow-900 mb-2">
                    ⚡ Tempo de Resposta Garantido
                  </h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Orientação médica: Imediata por telefone</li>
                    <li>• Atendimento domiciliar: Até 60 minutos</li>
                    <li>• Ambulância UTI: Até 45 minutos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-xl p-8 h-96 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-green-200/30"></div>
              
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoverageMap;