import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, Eye, Download, User, Upload, X, AlertTriangle, Camera, Users } from 'lucide-react';

interface ClientDocumentsUnifiedProps {
  user: any;
}

interface DocumentUpload {
  id: string;
  type: 'rg' | 'cpf' | 'proof_of_address' | 'birth_certificate';
  name: string;
  required: boolean;
  personType: 'titular' | 'beneficiary' | 'dependent';
  personName: string;
  personId?: string;
  status: 'not_uploaded' | 'uploaded' | 'approved' | 'rejected';
  rejectionReason?: string;
  file?: File;
  uploadedAt?: string;
}

interface Document {
  id: string;
  type: 'rg' | 'cnh';
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  fileName?: string;
  fileSize?: number;
  uploadDate?: string;
  url?: string;
}

const ClientDocumentsUnified: React.FC<ClientDocumentsUnifiedProps> = ({ user }) => {
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [isUploading, setIsUploading] = useState<{[key: string]: boolean}>({});
  const [selectedFile, setSelectedFile] = useState<{[key: string]: File | null}>({});
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [error, setError] = useState<string | null>(null);
  const [requiredDocuments, setRequiredDocuments] = useState<DocumentUpload[]>([
    { id: 'rg', type: 'rg', name: 'RG', status: 'not_uploaded', required: true, personType: 'titular', personName: user?.name || 'Usuário' },
    { id: 'cpf', type: 'cpf', name: 'CPF', status: 'not_uploaded', required: true, personType: 'titular', personName: user?.name || 'Usuário' },
  ]);

  // Adicionar documentos para dependentes se existirem
  useEffect(() => {
    if (user?.beneficiaries && user.beneficiaries.length > 0) {
      const dependentDocs: DocumentUpload[] = [];
      
      user.beneficiaries.forEach((beneficiary: any) => {
        dependentDocs.push(
          { 
            id: `rg-${beneficiary.id}`, 
            type: 'rg', 
            name: 'RG', 
            status: 'not_uploaded', 
            required: true, 
            personType: 'dependent', 
            personName: beneficiary.name,
            personId: beneficiary.id
          },
          { 
            id: `cpf-${beneficiary.id}`, 
            type: 'cpf', 
            name: 'CPF', 
            status: 'not_uploaded', 
            required: true, 
            personType: 'dependent', 
            personName: beneficiary.name,
            personId: beneficiary.id
          }
        );
      });
      
      setRequiredDocuments(prev => [...prev, ...dependentDocs]);
    }
  }, [user?.beneficiaries]);

  // Simular carregamento de documentos do usuário
  useEffect(() => {
    // Em produção, isso seria uma chamada à API
    const loadDocuments = async () => {
      try {
        // Simular documentos do usuário
        const userDocs = localStorage.getItem('userDocuments');
        if (userDocs) {
          const parsedDocs = JSON.parse(userDocs);
          setDocuments(parsedDocs);
          
          // Atualizar status dos documentos requeridos
          setRequiredDocuments(prev => 
            prev.map(reqDoc => {
              const foundDoc = parsedDocs.find((doc: any) => doc.id === reqDoc.id);
              return foundDoc ? { ...reqDoc, status: foundDoc.status } : reqDoc;
            })
          );
        } else {
          setDocuments([]);
        }
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
        setError('Não foi possível carregar seus documentos. Tente novamente mais tarde.');
      }
    };

    loadDocuments();
  }, []);

  // Salvar documentos no localStorage quando mudar
  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('userDocuments', JSON.stringify(documents));
    }
  }, [documents]);

  const handleFileChange = (docId: string, file: File | null) => {
    setSelectedFile(prev => ({ ...prev, [docId]: file }));
  };

  const handleUpload = async (docId: string) => {
    const file = selectedFile[docId];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [docId]: true }));
    setUploadProgress(prev => ({ ...prev, [docId]: 0 }));
    setError(null);

    try {
      // Simular upload com progresso
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(prev => ({ ...prev, [docId]: i }));
      }

      // Criar URL para o arquivo (em produção seria a URL do storage)
      const fileUrl = URL.createObjectURL(file);
      
      // Atualizar lista de documentos
      const existingDocIndex = documents.findIndex(doc => doc.id === docId);
      const newDoc: Document = {
        id: docId,
        type: docId as 'rg' | 'cnh',
        name: docId === 'rg' ? 'RG' : 'CNH',
        status: 'pending',
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        url: fileUrl
      };

      if (existingDocIndex >= 0) {
        // Atualizar documento existente
        const updatedDocs = [...documents];
        updatedDocs[existingDocIndex] = newDoc;
        setDocuments(updatedDocs);
      } else {
        // Adicionar novo documento
        setDocuments(prev => [...prev, newDoc]);
      }

      // Limpar estado de upload
      setSelectedFile(prev => ({ ...prev, [docId]: null }));
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setError('Ocorreu um erro ao enviar o documento. Tente novamente.');
    } finally {
      setIsUploading(prev => ({ ...prev, [docId]: false }));
      setUploadProgress(prev => ({ ...prev, [docId]: 0 }));
    }
  };

  const handleDelete = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const handleView = (docUrl?: string) => {
    if (docUrl) {
      window.open(docUrl, '_blank');
    }
  };

  // Encontrar documentos enviados
  const findDocument = (docId: string) => {
    return documents.find(doc => doc.id === docId);
  };

  // Calcular progresso geral
  const totalDocs = requiredDocuments.length;
  const uploadedDocs = documents.length;
  const progress = totalDocs > 0 ? (uploadedDocs / totalDocs) * 100 : 0;

  // Agrupar documentos por tipo de pessoa (titular ou dependente)
  const titularDocs = requiredDocuments.filter(doc => doc.personType === 'titular');
  
  // Agrupar documentos de dependentes por pessoa
  const dependentDocsGrouped = requiredDocuments
    .filter(doc => doc.personType === 'dependent')
    .reduce((acc, doc) => {
      if (!acc[doc.personName]) {
        acc[doc.personName] = [];
      }
      acc[doc.personName].push(doc);
      return acc;
    }, {} as Record<string, DocumentUpload[]>);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Documentos</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {/* Progresso dos Documentos */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progresso dos Documentos</h3>
          <span className="text-sm font-medium text-gray-600">
            {uploadedDocs} de {totalDocs} documentos enviados
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-green-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>{documents.filter(d => d.status === 'approved').length} Aprovados</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>{documents.filter(d => d.status === 'pending').length} Em análise</span>
          </div>
          <div className="flex items-center space-x-2">
            <X className="h-4 w-4 text-red-600" />
            <span>{documents.filter(d => d.status === 'rejected').length} Rejeitados</span>
          </div>
        </div>
      </div>

      {/* Documentos do Titular */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-blue-600" />
          Titular: {user?.name || 'Usuário'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {titularDocs.map(doc => {
            const uploadedDoc = findDocument(doc.id);
            const isUploaded = !!uploadedDoc;
            
            return (
              <div key={doc.id} className={`border-2 rounded-lg p-6 ${
                isUploaded 
                  ? uploadedDoc.status === 'approved' 
                    ? 'border-green-200 bg-green-50' 
                    : uploadedDoc.status === 'rejected'
                      ? 'border-red-200 bg-red-50'
                      : 'border-blue-200 bg-blue-50'
                  : 'border-dashed border-gray-300 hover:border-blue-400'
              } transition-colors`}>
                {isUploaded ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{doc.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {doc.id === 'rg' ? 'Documento de identidade' : 'Carteira Nacional de Habilitação'}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        uploadedDoc.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : uploadedDoc.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {uploadedDoc.status === 'approved' 
                          ? 'Aprovado' 
                          : uploadedDoc.status === 'rejected'
                            ? 'Rejeitado'
                            : 'Em análise'}
                      </div>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <p><span className="text-gray-500">Arquivo:</span> {uploadedDoc.fileName}</p>
                      <p><span className="text-gray-500">Tamanho:</span> {uploadedDoc.fileSize ? Math.round(uploadedDoc.fileSize / 1024) : 0} KB</p>
                      <p><span className="text-gray-500">Enviado em:</span> {uploadedDoc.uploadDate ? new Date(uploadedDoc.uploadDate).toLocaleDateString() : '-'}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(uploadedDoc.url)}
                        className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Visualizar</span>
                      </button>
                      
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <X className="h-4 w-4" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      {doc.id === 'rg' ? (
                        <FileText className="w-8 h-8 text-blue-600" />
                      ) : (
                        <Camera className="w-8 h-8 text-blue-600" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{doc.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {doc.id === 'rg' ? 'Documento de identidade' : 'Carteira Nacional de Habilitação'}
                      </p>
                    </div>
                    
                    {isUploading[doc.id] ? (
                      <div className="w-full">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Enviando...</span>
                          <span>{uploadProgress[doc.id]}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress[doc.id]}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          id={`file-${doc.id}`}
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={(e) => handleFileChange(doc.id, e.target.files ? e.target.files[0] : null)}
                        />
                        
                        <label
                          htmlFor={`file-${doc.id}`}
                          className="w-full cursor-pointer bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center space-x-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Selecionar Arquivo</span>
                        </label>
                        
                        {selectedFile[doc.id] && (
                          <div className="w-full">
                            <p className="text-sm text-gray-600 mb-2">
                              Arquivo selecionado: {selectedFile[doc.id]?.name}
                            </p>
                            <button
                              onClick={() => handleUpload(doc.id)}
                              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              Enviar Documento
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Documentos dos Dependentes */}
      {Object.keys(dependentDocsGrouped).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-600" />
            Documentos dos Dependentes
          </h3>
          
          {Object.entries(dependentDocsGrouped).map(([personName, docs]) => (
            <div key={personName} className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3 border-b pb-2">{personName}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {docs.map(doc => {
                  const uploadedDoc = findDocument(doc.id);
                  const isUploaded = !!uploadedDoc;
                  
                  return (
                    <div key={doc.id} className={`border-2 rounded-lg p-6 ${
                      isUploaded 
                        ? uploadedDoc.status === 'approved' 
                          ? 'border-green-200 bg-green-50' 
                          : uploadedDoc.status === 'rejected'
                            ? 'border-red-200 bg-red-50'
                            : 'border-blue-200 bg-blue-50'
                        : 'border-dashed border-gray-300 hover:border-blue-400'
                    } transition-colors`}>
                      {isUploaded ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg">{doc.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {doc.type === 'rg' ? 'Documento de identidade' : 'Cadastro de Pessoa Física'}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              uploadedDoc.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : uploadedDoc.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}>
                              {uploadedDoc.status === 'approved' 
                                ? 'Aprovado' 
                                : uploadedDoc.status === 'rejected'
                                  ? 'Rejeitado'
                                  : 'Em análise'}
                            </div>
                          </div>
                          
                          <div className="text-sm space-y-1">
                            <p><span className="text-gray-500">Arquivo:</span> {uploadedDoc.fileName}</p>
                            <p><span className="text-gray-500">Tamanho:</span> {uploadedDoc.fileSize ? Math.round(uploadedDoc.fileSize / 1024) : 0} KB</p>
                            <p><span className="text-gray-500">Enviado em:</span> {uploadedDoc.uploadDate ? new Date(uploadedDoc.uploadDate).toLocaleDateString() : '-'}</p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleView(uploadedDoc.url)}
                              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Visualizar</span>
                            </button>
                            
                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                              <X className="h-4 w-4" />
                              <span>Excluir</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            {doc.type === 'rg' ? (
                              <FileText className="w-8 h-8 text-blue-600" />
                            ) : (
                              <FileText className="w-8 h-8 text-blue-600" />
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">{doc.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {doc.type === 'rg' ? 'Documento de identidade' : 'Cadastro de Pessoa Física'}
                            </p>
                          </div>
                          
                          {isUploading[doc.id] ? (
                            <div className="w-full">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Enviando...</span>
                                <span>{uploadProgress[doc.id]}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${uploadProgress[doc.id]}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <input
                                type="file"
                                id={`file-${doc.id}`}
                                className="hidden"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={(e) => handleFileChange(doc.id, e.target.files ? e.target.files[0] : null)}
                              />
                              
                              <label
                                htmlFor={`file-${doc.id}`}
                                className="w-full cursor-pointer bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center space-x-2"
                              >
                                <Upload className="w-4 h-4" />
                                <span>Selecionar Arquivo</span>
                              </label>
                              
                              {selectedFile[doc.id] && (
                                <div className="w-full">
                                  <p className="text-sm text-gray-600 mb-2">
                                    Arquivo selecionado: {selectedFile[doc.id]?.name}
                                  </p>
                                  <button
                                    onClick={() => handleUpload(doc.id)}
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                  >
                                    Enviar Documento
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Instruções */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Instruções para Upload
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Formatos aceitos: JPG, PNG, PDF (máximo 5MB por arquivo)</li>
          <li>• Certifique-se de que o documento esteja legível e completo</li>
          <li>• Evite fotos com sombras ou reflexos</li>
          <li>• Os documentos são analisados automaticamente</li>
          <li>• Você receberá notificação sobre aprovação ou rejeição</li>
        </ul>
      </div>
    </div>
  );
};

export default ClientDocumentsUnified;