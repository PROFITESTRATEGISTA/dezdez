import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import SurveyPopup from '../../SurveyPopup';

const SurveyButton: React.FC = () => {
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Pesquisa de Satisfação</h3>
        
        <button 
          onClick={() => setIsSurveyOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Responder Pesquisa</span>
        </button>
      </div>
      
      <div className="mt-3 text-sm text-gray-600">
        Ajude-nos a melhorar nossos serviços compartilhando sua opinião.
      </div>

      <SurveyPopup 
        isOpen={isSurveyOpen} 
        onClose={() => setIsSurveyOpen(false)} 
      />
    </div>
  );
};

export default SurveyButton;