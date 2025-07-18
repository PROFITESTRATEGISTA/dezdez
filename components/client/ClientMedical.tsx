import React, { useState, useEffect } from 'react';
import { Heart, FileText, CheckCircle, Clock, AlertCircle, User, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClientMedicalProps {
  user: any;
}

interface MedicalHistory {
  id: string;
  condition: string;
  diagnosedDate: string;
  severity: 'low' | 'medium' | 'high';
  notes?: string;
}

interface QuestionnaireResponse {
  id: string;
  completedAt: string;
  responses: Record<string, any>;
}

const ClientMedical: React.FC<ClientMedicalProps> = ({ user }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [questionnaireStatus, setQuestionnaireStatus] = useState<{
    completed: boolean;
    completedAt: string | null;
  }>({ completed: false, completedAt: null });
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([]);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireResponse[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Verificar se há questionários salvos no localStorage (modo demo)
        const savedQuestionnairesStr = localStorage.getItem('medical_questionnaires');
        
        if (savedQuestionnairesStr) {
          const savedQuestionnaires = JSON.parse(savedQuestionnairesStr);
          
          if (savedQuestionnaires.length > 0) {
            setQuestionnaireStatus({
              completed: true,
              completedAt: savedQuestionnaires[0].completedAt
            });
            
            setQuestionnaires(savedQuestionnaires.map((q: any) => ({
              id: q.id,
              completedAt: q.completedAt,
              responses: q.responses
            })));
            
            // Extrair condições médicas do questionário mais recente
            const latestQuestionnaire = savedQuestionnaires[0];
            const conditions = extractMedicalConditions(latestQuestionnaire.responses);
            setMedicalHistory(conditions);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados médicos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleQuestionnaire = () => {
    navigate('/questionario-medico');
  };

  // Função para extrair condições médicas das respostas do questionário
  const extractMedicalConditions = (responses: Record<string, any>): MedicalHistory[] => {
    const conditions: MedicalHistory[] = [];
    
    // Verificar se há condições crônicas selecionadas
    if (responses.chronic_conditions && Array.isArray(responses.chronic_conditions)) {
      responses.chronic_conditions.forEach((condition: string, index: number) => {
        if (condition !== 'Nenhuma das anteriores') {
          conditions.push({
            id: `chronic-${index}`,
            condition: condition,
            diagnosedDate: new Date().toISOString().split('T')[0],
            severity: 'medium'
          });
        }
      });
    }
    
    // Verificar histórico familiar
    if (responses.family_history && Array.isArray(responses.family_history)) {
      responses.family_history.forEach((condition: string, index: number) => {
        if (condition !== 'Nenhuma das anteriores' && condition !== 'Não sei informar') {
          conditions.push({
            id: `family-${index}`,
            condition: `Histórico familiar: ${condition}`,
            diagnosedDate: new Date().toISOString().split('T')[0],
            severity: 'low',
            notes: 'Condição presente na família'
          });
        }
      });
    }
    
    // Adicionar informações adicionais se existirem
    if (responses.additional_info && typeof responses.additional_info === 'string' && responses.additional_info.trim()) {
      conditions.push({
        id: `additional-info`,
        condition: 'Informações adicionais',
        diagnosedDate: new Date().toISOString().split('T')[0],
        severity: 'medium',
        notes: responses.additional_info
      });
    }
    
    return conditions;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Histórico Médico</h2>
      
      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-6 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Status do Questionário */}
          {questionnaireStatus.completed ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Questionário Médico Concluído
                  </h3>
                  <p className="text-green-700 mb-4">
                    Seu questionário médico foi preenchido com sucesso em {questionnaireStatus.completedAt ? formatDate(questionnaireStatus.completedAt) : 'data não disponível'}.
                  </p>
                  <button
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    onClick={handleQuestionnaire}
                  >
                    Atualizar Questionário
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Heart className="h-6 w-6 text-red-600 mt-0.5 animate-pulse" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Questionário Médico Obrigatório
                  </h3>
                  <p className="text-red-700 mb-4">
                    Para ativar sua proteção, preencha o questionário médico. Processo obrigatório de 5 minutos.
                  </p>
                  <button
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                    onClick={handleQuestionnaire}
                  >
                    Preencher Questionário Médico
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Histórico Atual */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico Atual</h3>
            
            {medicalHistory.length > 0 ? (
              <div className="space-y-4">
                {medicalHistory.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.condition}</h4>
                        <p className="text-sm text-gray-600">Diagnosticado em: {formatDate(item.diagnosedDate)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
                        {item.severity === 'low' ? 'Leve' : 
                         item.severity === 'medium' ? 'Moderado' : 'Grave'}
                      </span>
                    </div>
                    {item.notes && (
                      <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {item.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 italic">
                Nenhum histórico médico informado
              </div>
            )}
          </div>

          {/* Histórico de Questionários */}
          {questionnaires.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Questionários Preenchidos</h3>
              
              <div className="space-y-4">
                {questionnaires.map((questionnaire) => (
                  <div key={questionnaire.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">
                          Questionário de {formatDate(questionnaire.completedAt)}
                        </h4>
                      </div>
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        onClick={() => alert('Visualização detalhada do questionário em desenvolvimento')}
                      >
                        Ver detalhes
                      </button>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {Object.keys(questionnaire.responses).length} perguntas respondidas
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientMedical;