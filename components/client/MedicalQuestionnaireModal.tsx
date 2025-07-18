import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Heart, CheckCircle, User, Activity, Pill, AlertTriangle, Brain, Users as UsersIcon, Stethoscope, Clock } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  subtitle?: string;
  text: string;
  type: 'yes_no' | 'text' | 'multiple' | 'checkbox' | 'scale';
  options?: string[];
  required: boolean;
  category: string;
  icon: React.ComponentType<any>;
  helpText?: string;
}

const questions: Question[] = [
  // Introdução
  {
    id: 'intro',
    title: 'Bem-vindo ao Questionário de Saúde',
    subtitle: 'Vamos conhecer melhor seu perfil médico',
    text: 'Este questionário nos ajuda a personalizar seu atendimento médico. Suas informações são confidenciais e seguras.',
    type: 'yes_no',
    options: ['Começar Questionário', 'Mais Tarde'],
    required: true,
    category: 'Introdução',
    icon: Heart,
    helpText: 'Processo rápido e seguro - apenas 5 minutos'
  },
  
  // Informações Básicas
  {
    id: 'age_group',
    title: 'Faixa Etária',
    text: 'Qual sua faixa etária atual?',
    type: 'multiple',
    options: ['18-29 anos', '30-39 anos', '40-49 anos', '50-59 anos', '60-69 anos', '70+ anos'],
    required: true,
    category: 'Dados Básicos',
    icon: User,
    helpText: 'Isso nos ajuda a personalizar as perguntas seguintes'
  },

  {
    id: 'gender',
    title: 'Gênero',
    text: 'Como você se identifica?',
    type: 'multiple',
    options: ['Masculino', 'Feminino', 'Não-binário', 'Prefiro não informar'],
    required: true,
    category: 'Dados Básicos',
    icon: User
  },

  // Condições de Saúde
  {
    id: 'chronic_conditions',
    title: 'Condições Crônicas',
    subtitle: 'Doenças que você possui atualmente',
    text: 'Você possui alguma das seguintes condições de saúde?',
    type: 'checkbox',
    options: [
      'Diabetes tipo 1 ou 2',
      'Hipertensão arterial',
      'Doença cardíaca',
      'Asma ou DPOC',
      'Artrite ou artrose',
      'Depressão',
      'Ansiedade',
      'Colesterol alto',
      'Obesidade',
      'Nenhuma das anteriores'
    ],
    required: true,
    category: 'Condições de Saúde',
    icon: Activity,
    helpText: 'Selecione todas que se aplicam ao seu caso'
  },

  // Medicamentos
  {
    id: 'medications',
    title: 'Uso de Medicamentos',
    text: 'Você toma algum medicamento regularmente?',
    type: 'yes_no',
    required: true,
    category: 'Medicamentos',
    icon: Pill
  },

  {
    id: 'medication_list',
    title: 'Lista de Medicamentos',
    text: 'Liste os medicamentos que você toma regularmente (nome e dosagem):',
    type: 'text',
    required: false,
    category: 'Medicamentos',
    icon: Pill,
    helpText: 'Exemplo: Losartana 50mg - 1 comprimido pela manhã'
  },

  // Alergias
  {
    id: 'allergies',
    title: 'Alergias',
    text: 'Você possui alergias a medicamentos, alimentos ou outras substâncias?',
    type: 'yes_no',
    required: true,
    category: 'Alergias',
    icon: AlertTriangle
  },

  {
    id: 'allergy_details',
    title: 'Detalhes das Alergias',
    text: 'Descreva suas alergias e as reações que você tem:',
    type: 'text',
    required: false,
    category: 'Alergias',
    icon: AlertTriangle,
    helpText: 'Inclua o que causa a alergia e qual reação você apresenta'
  },

  // Histórico Médico
  {
    id: 'hospitalizations',
    title: 'Hospitalizações Recentes',
    text: 'Você foi hospitalizado nos últimos 2 anos?',
    type: 'yes_no',
    required: true,
    category: 'Histórico Médico',
    icon: Stethoscope
  },

  {
    id: 'surgeries',
    title: 'Cirurgias',
    text: 'Você já passou por alguma cirurgia importante?',
    type: 'yes_no',
    required: true,
    category: 'Histórico Médico',
    icon: Stethoscope
  },

  // Estilo de Vida
  {
    id: 'exercise',
    title: 'Atividade Física',
    subtitle: 'Seu nível de exercícios',
    text: 'Com que frequência você pratica exercícios físicos?',
    type: 'multiple',
    options: [
      'Diariamente (todos os dias)',
      'Regularmente (4-6x por semana)',
      'Moderadamente (2-3x por semana)',
      'Ocasionalmente (1x por semana)',
      'Raramente ou nunca'
    ],
    required: true,
    category: 'Estilo de Vida',
    icon: Activity
  },

  {
    id: 'smoking',
    title: 'Tabagismo',
    text: 'Qual sua relação com o cigarro?',
    type: 'multiple',
    options: [
      'Nunca fumei',
      'Ex-fumante (parei há mais de 1 ano)',
      'Ex-fumante recente (parei há menos de 1 ano)',
      'Fumo ocasionalmente',
      'Fumo regularmente'
    ],
    required: true,
    category: 'Estilo de Vida',
    icon: Activity
  },

  // Saúde Mental
  {
    id: 'mental_health',
    title: 'Saúde Mental',
    text: 'Como você avalia sua saúde mental atualmente?',
    type: 'scale',
    required: true,
    category: 'Saúde Mental',
    icon: Brain,
    helpText: '1 = Muito ruim, 5 = Excelente'
  },

  // Histórico Familiar
  {
    id: 'family_history',
    title: 'Histórico Familiar',
    subtitle: 'Doenças na família',
    text: 'Algum familiar próximo (pais, irmãos, avós) teve alguma dessas condições?',
    type: 'checkbox',
    options: [
      'Câncer',
      'Doença cardíaca',
      'Diabetes',
      'Hipertensão',
      'AVC (derrame)',
      'Alzheimer ou demência',
      'Doença mental',
      'Nenhuma das anteriores'
    ],
    required: true,
    category: 'Histórico Familiar',
    icon: UsersIcon,
    helpText: 'Considere apenas familiares de primeiro e segundo grau'
  },

  // Avaliação Final
  {
    id: 'health_rating',
    title: 'Avaliação Geral',
    text: 'Como você avalia sua saúde geral hoje?',
    type: 'scale',
    required: true,
    category: 'Avaliação Final',
    icon: Heart,
    helpText: '1 = Muito ruim, 5 = Excelente'
  },

  {
    id: 'additional_info',
    title: 'Informações Adicionais',
    text: 'Há algo mais sobre sua saúde que gostaria de compartilhar?',
    type: 'text',
    required: false,
    category: 'Avaliação Final',
    icon: Heart,
    helpText: 'Campo opcional para informações importantes'
  }
];

interface MedicalQuestionnaireModalProps {
  onClose: () => void;
  onComplete: () => void;
}

const MedicalQuestionnaireModal: React.FC<MedicalQuestionnaireModalProps> = ({ onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({
    // Pré-preencher a primeira resposta para facilitar o teste
    'intro': 'Começar Questionário'
  });
  const [isCompleting, setIsCompleting] = useState(false);

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    console.log(`Respondendo questão ${questionId} com:`, answer);
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      console.log(`Avançando para questão ${currentStep + 1}`);
      setCurrentStep(prev => prev + 1);
    } else {
      console.log('Finalizando questionário');
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      console.log(`Voltando para questão ${currentStep - 1}`);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    console.log('Iniciando processo de conclusão');
    setIsCompleting(true);
    // Simula processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Questionário concluído com sucesso');
    onComplete();
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const canProceed = currentQuestion.required ? answers[currentQuestion?.id] : true;
  const Icon = currentQuestion?.icon || Heart;

  if (isCompleting) {
    console.log('Renderizando tela de processamento');
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Processando Questionário</h3>
          <p className="text-gray-600 mb-6">
            Analisando suas respostas e criando seu perfil de saúde...
          </p>
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Suas informações estão seguras</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log(`Renderizando questão ${currentStep + 1}/${questions.length}: ${currentQuestion?.title}`);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Questionário de Saúde</h2>
                <p className="text-red-100 text-sm">{currentQuestion?.category}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:text-red-200 transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-2">
              <span>Questão {currentStep + 1} de {questions.length}</span>
              <span>{Math.round(progress)}% concluído</span>
            </div>
            <div className="w-full bg-red-800/50 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-8">
            {/* Question */}
            <div className="mb-6">
              {currentQuestion?.subtitle && (
                <p className="text-red-600 font-medium text-sm mb-2 uppercase tracking-wide">
                  {currentQuestion.subtitle}
                </p>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {currentQuestion?.title}
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentQuestion?.text}
                {currentQuestion?.required && <span className="text-red-500 ml-1">*</span>}
              </p>
              {currentQuestion?.helpText && (
                <p className="text-sm text-gray-500 mt-2 italic">
                  💡 {currentQuestion.helpText}
                </p>
              )}
            </div>
            
            {/* Answer Options */}
            <div className="space-y-4">
              {/* Yes/No Questions */}
              {currentQuestion?.type === 'yes_no' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(currentQuestion.options || ['Sim', 'Não']).map(option => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(currentQuestion.id, option)}
                      className={`p-6 text-left border-2 rounded-xl transition-all duration-200 ${
                        answers[currentQuestion.id] === option
                          ? 'border-red-500 bg-red-50 text-red-900 shadow-md transform scale-105'
                          : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion.id] === option
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                        }`}>
                          {answers[currentQuestion.id] === option && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="font-semibold text-lg">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Multiple Choice */}
              {currentQuestion?.type === 'multiple' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map(option => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(currentQuestion.id, option)}
                      className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                        answers[currentQuestion.id] === option
                          ? 'border-red-500 bg-red-50 text-red-900 shadow-md'
                          : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          answers[currentQuestion.id] === option
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300'
                        }`}>
                          {answers[currentQuestion.id] === option && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Checkbox */}
              {currentQuestion?.type === 'checkbox' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map(option => {
                    const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
                    const isSelected = currentAnswers.includes(option);
                    
                    return (
                      <button
                        key={option}
                        onClick={() => {
                          const newAnswers = isSelected
                            ? currentAnswers.filter(a => a !== option)
                            : [...currentAnswers, option];
                          handleAnswer(currentQuestion.id, newAnswers);
                        }}
                        className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                          isSelected
                            ? 'border-red-500 bg-red-50 text-red-900 shadow-md'
                            : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-red-500 bg-red-500'
                              : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="font-medium">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Text */}
              {currentQuestion?.type === 'text' && (
                <textarea
                  value={(answers[currentQuestion.id] as string) || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none resize-none text-lg"
                  rows={4}
                  placeholder="Digite sua resposta aqui..."
                />
              )}

              {/* Scale */}
              {currentQuestion?.type === 'scale' && (
                <div className="space-y-6">
                  <div className="flex justify-between text-sm text-gray-600 px-2">
                    <span>Muito ruim</span>
                    <span>Excelente</span>
                  </div>
                  <div className="flex space-x-3">
                    {[1, 2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        onClick={() => handleAnswer(currentQuestion.id, num.toString())}
                        className={`flex-1 py-4 border-2 rounded-xl font-bold text-lg transition-all duration-200 ${
                          answers[currentQuestion.id] === num.toString()
                            ? 'border-red-500 bg-red-50 text-red-700 shadow-md transform scale-105'
                            : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Required field alert */}
          {currentQuestion?.required && !canProceed && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Esta pergunta é obrigatória para continuar
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 flex justify-between items-center border-t">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-6 py-3 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 transition-colors rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Anterior</span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
              {currentStep + 1} / {questions.length}
            </div>
            <div className="text-xs text-gray-400 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              ~{Math.max(1, Math.ceil((questions.length - currentStep) * 0.5))} min restantes
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex items-center space-x-2 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
          >
            <span>{currentStep === questions.length - 1 ? 'Finalizar' : 'Próxima'}</span>
            {currentStep === questions.length - 1 ? 
              <CheckCircle className="h-5 w-5" /> : 
              <ArrowRight className="h-5 w-5" />
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalQuestionnaireModal;