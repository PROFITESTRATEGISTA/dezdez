import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Filter, Eye, Download, User, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';

interface QuestionnaireResponse {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  completedAt: string;
  responseCount: number;
  responses: Record<string, any>;
}

const QuestionnaireManagement: React.FC = () => {
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<QuestionnaireResponse | null>(null);
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get questionnaires with user info
        const { data, error } = await supabase
          .from('medical_questionnaires')
          .select(`
            id,
            user_id,
            responses,
            completed_at,
            users!medical_questionnaires_user_id_fkey (
              id,
              full_name,
              email
            )
          `)
          .order('completed_at', { ascending: false });
          
        if (error) throw error;
        
        // Format questionnaires
        const formattedQuestionnaires = data.map((q: any) => ({
          id: q.id,
          userId: q.user_id,
          userName: q.users?.full_name || 'Usuário Desconhecido',
          userEmail: q.users?.email || '',
          completedAt: q.completed_at,
          responseCount: Object.keys(q.responses || {}).length,
          responses: q.responses || {}
        }));
        
        setQuestionnaires(formattedQuestionnaires);
      } catch (error) {
        console.error('Error fetching questionnaires:', error);
        setError('Falha ao carregar questionários. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionnaires();
  }, []);

  const filteredQuestionnaires = questionnaires.filter(q => {
    return q.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleViewQuestionnaire = (questionnaire: QuestionnaireResponse) => {
    setSelectedQuestionnaire(questionnaire);
    setShowQuestionnaireModal(true);
  };

  const handleDownloadQuestionnaire = (questionnaire: QuestionnaireResponse) => {
    const dataStr = JSON.stringify(questionnaire.responses, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `questionario_${questionnaire.userName.replace(/\s+/g, '_').toLowerCase()}_${new Date(questionnaire.completedAt).toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get a readable value from questionnaire responses
  const getReadableValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    } else if (typeof value === 'boolean') {
      return value ? 'Sim' : 'Não';
    } else if (value === null || value === undefined) {
      return 'Não informado';
    } else {
      return String(value);
    }
  };

  // Helper function to get a readable question title
  const getQuestionTitle = (questionId: string): string => {
    const questionMap: Record<string, string> = {
      'intro': 'Introdução',
      'age_group': 'Faixa Etária',
      'gender': 'Gênero',
      'chronic_conditions': 'Condições Crônicas',
      'medications': 'Medicamentos',
      'medication_list': 'Lista de Medicamentos',
      'allergies': 'Alergias',
      'allergy_details': 'Detalhes das Alergias',
      'hospitalizations': 'Hospitalizações',
      'surgeries': 'Cirurgias',
      'exercise': 'Atividade Física',
      'smoking': 'Tabagismo',
      'alcohol': 'Consumo de Álcool',
      'mental_health': 'Saúde Mental',
      'stress_level': 'Nível de Estresse',
      'family_history': 'Histórico Familiar',
      'health_rating': 'Avaliação Geral',
      'additional_info': 'Informações Adicionais'
    };
    
    return questionMap[questionId] || questionId;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Questionários Médicos</h2>
          <p className="mt-1 text-sm text-gray-500">
            Visualize e analise os questionários médicos preenchidos pelos clientes
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total de Questionários</dt>
                <dd className="text-lg font-medium text-gray-900">{questionnaires.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Últimos 30 dias</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {questionnaires.filter(q => {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return new Date(q.completedAt) >= thirtyDaysAgo;
                  }).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Taxa de Conclusão</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {questionnaires.length > 0 ? '100%' : '0%'}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar por nome ou email do cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Questionnaires Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Lista de Questionários ({filteredQuestionnaires.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Preenchimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Respostas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuestionnaires.length > 0 ? (
                filteredQuestionnaires.map((questionnaire) => (
                  <tr key={questionnaire.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{questionnaire.userName}</div>
                          <div className="text-sm text-gray-500">{questionnaire.userEmail}</div>
                          <div className="text-xs text-gray-400">ID: {questionnaire.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(questionnaire.completedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {questionnaire.responseCount} perguntas respondidas
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewQuestionnaire(questionnaire)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Visualizar</span>
                        </button>
                        <button
                          onClick={() => handleDownloadQuestionnaire(questionnaire)}
                          className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                        >
                          <Download className="h-4 w-4" />
                          <span>Baixar JSON</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    {error ? 'Erro ao carregar questionários' : 'Nenhum questionário encontrado'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Questionnaire Viewer Modal */}
      {showQuestionnaireModal && selectedQuestionnaire && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Questionário Médico</h3>
                <p className="text-sm text-gray-500">
                  {selectedQuestionnaire.userName} • {formatDate(selectedQuestionnaire.completedAt)}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowQuestionnaireModal(false);
                  setSelectedQuestionnaire(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {Object.entries(selectedQuestionnaire.responses).map(([questionId, value]) => (
                  <div key={questionId} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{getQuestionTitle(questionId)}</h4>
                    <div className="text-gray-700">
                      <p className="bg-gray-50 p-3 rounded">
                        {getReadableValue(value)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  ID do Questionário: {selectedQuestionnaire.id}
                </div>
                <button
                  onClick={() => handleDownloadQuestionnaire(selectedQuestionnaire)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Baixar Respostas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireManagement;