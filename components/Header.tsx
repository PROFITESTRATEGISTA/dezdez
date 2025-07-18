import React from 'react';
import { ArrowLeft, Info, User } from 'lucide-react';

interface HeaderProps {
  onBackToSite: () => void;
  onViewBenefits: () => void;
  onAdminAccess: () => void;
  onClientAccess: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBackToSite, onViewBenefits, onAdminAccess, onClientAccess }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <img 
              src="/image (1).png" 
              alt="Dez Emergências Médicas" 
              className="h-10 w-auto"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onViewBenefits}
              className="flex items-center space-x-2 px-6 py-3 text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
            >
              <Info className="h-5 w-5" />
              <span>Ver Benefícios</span>
            </button>

            <button
              onClick={onClientAccess}
              className="flex items-center space-x-2 px-4 py-2 text-green-700 hover:bg-green-50 rounded-lg transition-colors border border-green-200"
            >
              <User className="h-4 w-4" />
              <span>Área do Cliente</span>
            </button>

            <button
              onClick={onBackToSite}
              className="flex items-center space-x-2 px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao Site</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;