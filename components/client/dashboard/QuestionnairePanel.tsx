import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuestionnairePanel: React.FC = () => {
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const handleQuestionnaireClick = () => {
    navigate('/questionario-medico');
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-red-900">Questionário Médico</h3>
        
        <button
          onClick={handleQuestionnaireClick}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors animate-pulse font-medium"
        >
          {questionnaireCompleted ? (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Questionário Concluído</span>
            </div>
          ) : (
            <span>Preencher Questionário Médico</span>
          )}
        </button>
      </div>
      
      {!questionnaireCompleted && (
        <div className="mt-3 flex items-start space-x-3">
          <Heart className="h-5 w-5 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-700 font-medium mb-1">
              Preencha o questionário médico para ativar sua proteção
            </p>
            <p className="text-sm text-red-600">
              Processo obrigatório de apenas 5 minutos para personalizar seu atendimento de emergência
            </p>
            <div className="mt-3">
              <button
                onClick={handleQuestionnaireClick}
                className="text-sm bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors"
              >
                Preencher Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionnairePanel;