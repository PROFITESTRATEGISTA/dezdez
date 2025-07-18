import React, { useState } from 'react';
import { Upload, FileText, User, Users, CheckCircle, Clock, MessageCircle, AlertCircle, Bot, Sparkles, Mail, FileCheck } from 'lucide-react';
import { CheckoutData } from '../types';

interface DocumentUploadProps {
  checkoutData: CheckoutData;
  onComplete: () => void;
}

interface ChatGPTAnalysis {
  isValid: boolean;
  documentType: string;
  confidence: number;
  issues?: string[];
  suggestions?: string[];
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ checkoutData, onComplete }) => {
  const [uploadedDocs, setUploadedDocs] = useState<{[key: string]: boolean}>({});
  const [docAnalysis, setDocAnalysis] = useState<{[key: string]: ChatGPTAnalysis}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState<{[key: string]: boolean}>({});
  const [documentsApproved, setDocumentsApproved] = useState(false);
  const [contractSent, setContractSent] = useState(false);

  // Verificar se checkoutData existe antes de usar
  if (!checkoutData || !checkoutData.mainUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro nos dados do pedido</h2>
          <p className="text-gray-600 mb-4">
            Não foi possível carregar os dados do seu pedido. Por favor, tente novamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    );
  }

  const requiredDocs = [
    {
      id: 'titular-rg',
      name: 'RG do Titular',
      person: checkoutData.mainUser.name,
      required: true,
      type: 'rg'
    },
    {
      id: 'titular-cpf',
      name: 'CPF do Titular',
      person: checkoutData.mainUser.name,
      required: true,
      type: 'cpf'
    },
    ...(checkoutData.beneficiaries || []).flatMap(beneficiary => [
      {
        id: `beneficiary-${beneficiary.id}-rg`,
        name: 'RG',
        person: beneficiary.name,
        personId: beneficiary.id,
        required: true,
        type: 'rg'
      },
      {
        id: `beneficiary-${beneficiary.id}-cpf`,
        name: 'CPF',
        person: beneficiary.name,
        personId: beneficiary.id,
        required: true,
        type: 'cpf'
      }
    ])
  ];

  const simulateChatGPTAnalysis = async (docType: string): Promise<ChatGPTAnalysis> => {
    // Simula análise do ChatGPT
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analyses = {
      rg: {
        isValid: Math.random() > 0.2,
        documentType: 'Registro Geral (RG)',
        confidence: 0.95,
        issues: Math.random() > 0.7 ? ['Imagem um pouco desfocada na parte inferior'] : undefined,
        suggestions: ['Documento válido e legível', 'Todas as informações estão visíveis']
      },
      cpf: {
        isValid: Math.random() > 0.15,
        documentType: 'Cadastro de Pessoa Física (CPF)',
        confidence: 0.98,
        issues: Math.random() > 0.8 ? ['Qualidade da imagem poderia ser melhor'] : undefined,
        suggestions: ['Documento em boa qualidade', 'Números claramente visíveis']
      }
    };

    return analyses[docType as keyof typeof analyses] || analyses.rg;
  };

  const handleFileUpload = async (docId: string, docType: string) => {
    setIsAnalyzing(prev => ({ ...prev, [docId]: true }));
    
    try {
      // Simula upload e análise
      const analysis = await simulateChatGPTAnalysis(docType);
      
      setDocAnalysis(prev => ({ ...prev, [docId]: analysis }));
      setUploadedDocs(prev => ({ ...prev, [docId]: true }));
    } catch (error) {
      console.error('Erro na análise:', error);
    } finally {
      setIsAnalyzing(prev => ({ ...prev, [docId]: false }));
    }
  };

  const handleSubmit = async () => {
    const allDocsUploaded = requiredDocs.every(doc => uploadedDocs[doc.id]);
    const allDocsValid = requiredDocs.every(doc => 
      docAnalysis[doc.id]?.isValid !== false
    );
    
    if (!allDocsUploaded) {
      alert('Por favor, envie todos os documentos obrigatórios.');
      return;
    }

    if (!allDocsValid) {
      alert('Alguns documentos precisam ser reenviados. Verifique as sugestões da análise automática.');
      return;
    }

    setIsSubmitting(true);
    
    // Simula envio dos documentos
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simula aprovação automática dos documentos (em produção seria via admin/IA)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDocumentsApproved(true);
    
    // Simula envio do contrato por email
    await new Promise(resolve => setTimeout(resolve, 1000));
    setContractSent(true);
    
    setIsSubmitting(false);
  };

  const handleWhatsAppSupport = () => {
    const phone = '5511999999999';
    const message = encodeURIComponent(
      `Olá! Preciso de ajuda com o upload de documentos para meu plano Dez Emergências.\n\n` +
      `Titular: ${checkoutData.mainUser.name}\n` +
      `Beneficiários: ${(checkoutData.beneficiaries || []).length}\n\n` +
      `Aguardo orientações de um consultor.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleSignContract = () => {
    alert('Redirecionando para assinatura digital do contrato...');
    // Em produção, redirecionaria para plataforma de assinatura digital
    onComplete();
  };

  const totalDocs = requiredDocs.length;
  const uploadedCount = Object.values(uploadedDocs).filter(Boolean).length;
  const validDocsCount = Object.values(docAnalysis).filter(analysis => analysis.isValid).length;
  const progress = totalDocs > 0 ? (uploadedCount / totalDocs) * 100 : 0;

  // Tela de aprovação e assinatura de contrato
  if (documentsApproved && contractSent) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <img 
                  src="/image (1).png" 
                  alt="Dez Emergências Médicas" 
                  className="h-10 w-auto"
                />
                <span className="text-lg font-semibold text-blue-900">Assinatura do Contrato</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
              <div>
                <h2 className="text-xl font-semibold text-green-900 mb-2">
                  🎉 Documentos Aprovados!
                </h2>
                <p className="text-green-700 mb-4">
                  Todos os seus documentos foram analisados e aprovados com sucesso. 
                  Agora você precisa assinar o contrato para ativar sua proteção.
                </p>
                <div className="bg-green-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-sm text-green-800">
                    <FileCheck className="h-4 w-4" />
                    <span className="font-medium">Análise concluída em tempo recorde!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Signing */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center mb-6">
              <FileText className="h-6 w-6 text-blue-900 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Assinatura do Contrato</h3>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-start space-x-3">
                <Mail className="h-6 w-6 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    📧 Contrato Enviado por E-mail
                  </h4>
                  <p className="text-blue-700 mb-4">
                    O contrato de prestação de serviços foi enviado para o e-mail: 
                    <strong className="ml-1">{checkoutData.mainUser.email}</strong>
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Dados do Contrato:</h5>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div><strong>Titular:</strong> {checkoutData.mainUser.name}</div>
                      <div><strong>Plano:</strong> Dez Emergências - {
                        checkoutData.billingPeriod === 'monthly' ? 'Mensal' :
                        checkoutData.billingPeriod === 'annual' ? 'Anual' : 'Bianual'
                      }</div>
                      {(checkoutData.beneficiaries || []).length > 0 && (
                        <div><strong>Beneficiários:</strong> {(checkoutData.beneficiaries || []).length}</div>
                      )}
                      <div><strong>Valor:</strong> {checkoutData.totalAmount ? `R$ ${checkoutData.totalAmount.toFixed(2).replace('.', ',')}` : 'Calculando...'}</div>
                    </div>
                  </div>

                  <div className="text-sm text-blue-600">
                    ✅ Verifique sua caixa de entrada e spam<br/>
                    ✅ O contrato está pronto para assinatura digital<br/>
                    ✅ Processo 100% online e seguro
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">📋 Próximos Passos:</h4>
                <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                  <li>Verifique seu e-mail</li>
                  <li>Abra o contrato anexado</li>
                  <li>Leia todos os termos</li>
                  <li>Assine digitalmente</li>
                  <li>Sua proteção será ativada!</li>
                </ol>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">⚡ Ativação Imediata:</h4>
                <div className="text-sm text-green-800 space-y-1">
                  <div>• Proteção ativa após assinatura</div>
                  <div>• Central 24h disponível</div>
                  <div>• Carteirinha digital no app</div>
                  <div>• Benefícios liberados</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleSignContract}
                className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <FileText className="h-5 w-5" />
                <span>Ir para Assinatura Digital</span>
              </button>
              
              <p className="text-sm text-gray-500 mt-3">
                Você será redirecionado para a plataforma de assinatura digital
              </p>
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="text-center">
              <h4 className="font-semibold text-blue-900 mb-2">Precisa de ajuda?</h4>
              <p className="text-blue-700 mb-4">
                Nossa equipe está pronta para auxiliar você no processo de assinatura do contrato.
              </p>
              
              <button
                onClick={handleWhatsAppSupport}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Falar com um consultor</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/image (1).png" 
                alt="Dez Emergências Médicas" 
                className="h-10 w-auto"
              />
              <span className="text-lg font-semibold text-blue-900">Upload de Documentos</span>
            </div>
            
            <button
              onClick={handleWhatsAppSupport}
              className="flex items-center space-x-2 px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Precisa de ajuda?</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
            <div>
              <h2 className="text-xl font-semibold text-green-900 mb-2">
                🎉 Pagamento Confirmado!
              </h2>
              <p className="text-green-700 mb-4">
                Seu plano Dez Emergências foi contratado com sucesso. Para ativar sua proteção, 
                precisamos que você envie os documentos abaixo.
              </p>
              <div className="bg-green-100 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-sm text-green-800">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Ativação em até 3 dias úteis após análise dos documentos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ChatGPT Integration Banner */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 rounded-full p-2">
              <Bot className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Análise Automática com IA
              </h3>
              <p className="text-purple-700 mb-3">
                Seus documentos são analisados automaticamente por inteligência artificial para 
                garantir qualidade e acelerar o processo de aprovação.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-purple-700">Verificação instantânea</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-purple-700">Sugestões de melhoria</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-purple-700">Processo mais rápido</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Progresso do Upload</h3>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{uploadedCount}</span> de {totalDocs} documentos
              {validDocsCount > 0 && (
                <span className="ml-2 text-green-600">
                  • {validDocsCount} validados ✓
                </span>
              )}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-600">
            {progress === 100 ? 
              '✅ Todos os documentos foram enviados!' : 
              `Faltam ${totalDocs - uploadedCount} documento${totalDocs - uploadedCount !== 1 ? 's' : ''} para completar`
            }
          </p>
        </div>

        {/* Document Upload */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <FileText className="h-6 w-6 text-blue-900 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Documentos Necessários</h3>
          </div>

          <div className="space-y-6">
            {/* Titular */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Titular: {checkoutData.mainUser.name}</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-7">
                {requiredDocs.filter(doc => doc.person === checkoutData.mainUser.name).map(doc => {
                  const analysis = docAnalysis[doc.id];
                  const isAnalyzing = isAnalyzing[doc.id];
                  const isUploaded = uploadedDocs[doc.id];
                  
                  return (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="text-center">
                        <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                          isAnalyzing ? 'bg-yellow-100 text-yellow-600' :
                          analysis?.isValid === false ? 'bg-red-100 text-red-600' :
                          isUploaded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isAnalyzing ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                          ) : analysis?.isValid === false ? (
                            <AlertCircle className="h-6 w-6" />
                          ) : isUploaded ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <Upload className="h-6 w-6" />
                          )}
                        </div>
                        
                        <h5 className="font-medium text-gray-900 mb-2">{doc.name}</h5>
                        
                        {isAnalyzing ? (
                          <div className="text-yellow-600 text-sm font-medium">
                            🤖 Analisando com IA...
                          </div>
                        ) : analysis ? (
                          <div className="space-y-2">
                            <div className={`text-sm font-medium ${
                              analysis.isValid ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {analysis.isValid ? '✅ Documento válido' : '❌ Reenviar documento'}
                            </div>
                            
                            <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                              <div className="font-medium mb-1">Análise IA:</div>
                              <div>Confiança: {Math.round(analysis.confidence * 100)}%</div>
                              {analysis.issues && (
                                <div className="text-red-600 mt-1">
                                  ⚠️ {analysis.issues[0]}
                                </div>
                              )}
                            </div>
                            
                            {!analysis.isValid && (
                              <button
                                onClick={() => handleFileUpload(doc.id, doc.type)}
                                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                Reenviar Arquivo
                              </button>
                            )}
                          </div>
                        ) : isUploaded ? (
                          <div className="text-green-600 text-sm font-medium">✅ Enviado</div>
                        ) : (
                          <button
                            onClick={() => handleFileUpload(doc.id, doc.type)}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Enviar Arquivo
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Beneficiários */}
            {(checkoutData.beneficiaries || []).map(beneficiary => (
              <div key={beneficiary.id}>
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">
                    Beneficiário: {beneficiary.name} ({beneficiary.relationship}, {beneficiary.age} anos)
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                  {requiredDocs.filter(doc => doc.person === beneficiary.name).map(doc => {
                    const analysis = docAnalysis[doc.id];
                    const isAnalyzing = isAnalyzing[doc.id];
                    const isUploaded = uploadedDocs[doc.id];
                    
                    return (
                      <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="text-center">
                          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                            isAnalyzing ? 'bg-yellow-100 text-yellow-600' :
                            analysis?.isValid === false ? 'bg-red-100 text-red-600' :
                            isUploaded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {isAnalyzing ? (
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                            ) : analysis?.isValid === false ? (
                              <AlertCircle className="h-6 w-6" />
                            ) : isUploaded ? (
                              <CheckCircle className="h-6 w-6" />
                            ) : (
                              <Upload className="h-6 w-6" />
                            )}
                          </div>
                          
                          <h5 className="font-medium text-gray-900 mb-2">{doc.name}</h5>
                          
                          {isAnalyzing ? (
                            <div className="text-yellow-600 text-sm font-medium">
                              🤖 Analisando com IA...
                            </div>
                          ) : analysis ? (
                            <div className="space-y-2">
                              <div className={`text-sm font-medium ${
                                analysis.isValid ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {analysis.isValid ? '✅ Documento válido' : '❌ Reenviar documento'}
                              </div>
                              
                              <div className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                                <div className="font-medium mb-1">Análise IA:</div>
                                <div>Confiança: {Math.round(analysis.confidence * 100)}%</div>
                                {analysis.issues && (
                                  <div className="text-red-600 mt-1">
                                    ⚠️ {analysis.issues[0]}
                                  </div>
                                )}
                              </div>
                              
                              {!analysis.isValid && (
                                <button
                                  onClick={() => handleFileUpload(doc.id, doc.type)}
                                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm"
                                >
                                  Reenviar Arquivo
                                </button>
                              )}
                            </div>
                          ) : isUploaded ? (
                            <div className="text-green-600 text-sm font-medium">✅ Enviado</div>
                          ) : (
                            <button
                              onClick={() => handleFileUpload(doc.id, doc.type)}
                              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              Enviar Arquivo
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-2">Informações Importantes</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Documentos são analisados automaticamente por IA para garantir qualidade</li>
                <li>• Formatos aceitos: JPG, PNG, PDF (máximo 5MB por arquivo)</li>
                <li>• A análise final será feita em até 3 dias úteis</li>
                <li>• Você receberá confirmação por email e WhatsApp</li>
                <li>• O contrato será enviado por email após aprovação dos documentos</li>
                <li>• Em caso de dúvidas, entre em contato via WhatsApp</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || uploadedCount < totalDocs || Object.values(docAnalysis).some(analysis => analysis.isValid === false)}
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Enviando documentos...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                <span>Finalizar Envio de Documentos</span>
              </>
            )}
          </button>
          
          {uploadedCount < totalDocs && (
            <p className="text-sm text-gray-500 mt-3">
              Envie todos os documentos para prosseguir
            </p>
          )}
          
          {Object.values(docAnalysis).some(analysis => analysis.isValid === false) && (
            <p className="text-sm text-red-500 mt-3">
              Alguns documentos precisam ser reenviados conforme análise da IA
            </p>
          )}
        </div>

        {/* Support Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <div className="text-center">
            <h4 className="font-semibold text-blue-900 mb-2">Precisa de ajuda?</h4>
            <p className="text-blue-700 mb-4">
              Nossa equipe de suporte está pronta para auxiliar você no processo de upload dos documentos.
            </p>
            
            <button
              onClick={handleWhatsAppSupport}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Falar com um consultor</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;