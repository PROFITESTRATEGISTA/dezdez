import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Clock, XCircle, AlertTriangle, User, Users, Camera, File } from 'lucide-react';

interface DocumentUpload {
  id: string;
  type: 'rg' | 'cpf' | 'proof_of_address' | 'birth_certificate';
  name: string;
  required: boolean;
  personType: 'titular' | 'beneficiary';
  personName: string;
  personId?: string;
  status: 'not_uploaded' | 'uploaded' | 'approved' | 'rejected';
  rejectionReason?: string;
  file?: File;
  uploadedAt?: string;
}

interface ClientDocumentUploadProps {
  user: any;
}

const ClientDocumentUpload: React.FC<ClientDocumentUploadProps> = ({ user }) => {
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    // Documentos do titular
    {
      id: 'titular-rg',
      type: 'rg',
      name: 'RG',
      required: true,
      personType: 'titular',
      personName: 'Pedro Pardal',
      status: 'approved'
    },
    {
      id: 'titular-cpf',
      type: 'cpf',
      name: 'CPF',
      required: true,
      personType: 'titular',
      personName: 'Pedro Pardal',
      status: 'approved'
    },
    {
      id: 'titular-address',
      type: 'proof_of_address',
      name: 'Comprovante de Residência',
      required: true,
      personType: 'titular',
      personName: 'Pedro Pardal',
      status: 'approved'
    },
    // Documentos dos beneficiários
    {
      id: 'beneficiary-1-rg',
      type: 'rg',
      name: 'RG',
      required: true,
      personType: 'beneficiary',
      personName: 'Maria Pardal',
      personId: 'BEN001',
      status: 'approved'
    },
    {
      id: 'beneficiary-1-cpf',
      type: 'cpf',
      name: 'CPF',
      required: true,
      personType: 'beneficiary',
      personName: 'Maria Pardal',
      personId: 'BEN001',
      status: 'approved'
    }
  ]);

  const [isUploading, setIsUploading] = useState<string | null>(null);

  const handleFileUpload = async (documentId: string, file: File) => {
    setIsUploading(documentId);
    
    // Simula upload do arquivo
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId 
        ? { 
            ...doc, 
            status: 'uploaded' as const,
            file,
            uploadedAt: new Date().toISOString()
          }
        : doc
    ));
    
    setIsUploading(null);
    
    // Simula análise automática após 3 segundos
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              status: 'approved' as const // ou 'rejected' baseado na análise
            }
          : doc
      ));
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'uploaded': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5" />;
      case 'uploaded': return <Clock className="h-5 w-5" />;
      case 'rejected': return <XCircle className="h-5 w-5" />;
      default: return <Upload className="h-5 w-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'uploaded': return 'Em análise';
      case 'rejected': return 'Rejeitado';
      default: return 'Não enviado';
    }
  };

  const titularDocs = documents.filter(doc => doc.personType === 'titular');
  const beneficiaryDocs = documents.filter(doc => doc.personType === 'beneficiary');
  
  // Agrupar documentos de beneficiários por pessoa
  const beneficiariesGrouped = beneficiaryDocs.reduce((acc, doc) => {
    if (!acc[doc.personName]) {
      acc[doc.personName] = [];
    }
    acc[doc.personName].push(doc);
    return acc;
  }, {} as Record<string, DocumentUpload[]>);

  const totalDocs = documents.length;
  const approvedDocs = documents.filter(doc => doc.status === 'approved').length;
  const progress = totalDocs > 0 ? (approvedDocs / totalDocs) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Documentos</h2>
        <div className="text-sm text-gray-600">
          {approvedDocs} de {totalDocs} documentos aprovados
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progresso dos Documentos</h3>
          <span className="text-sm font-medium text-gray-600">100% concluído</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-green-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `100%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>5 Aprovados</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>0 Em análise</span>
          </div>
          <div className="flex items-center space-x-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <span>0 Rejeitados</span>
          </div>
        </div>
      </div>

      {/* Documentos do Titular */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-blue-600" />
          Titular: Pedro Pardal
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {titularDocs.map((document) => (
            <div key={document.id} className="border-2 rounded-lg p-4 bg-green-50 border-green-200">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-green-100 text-green-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
                
                <h5 className="font-medium text-gray-900 mb-2">{document.name}</h5>
                
                <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100 mb-3">
                  <CheckCircle className="h-4 w-4" />
                  <span>Aprovado</span>
                </div>

                <div className="text-green-600 text-sm">
                  ✅ Documento aprovado
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documentos dos Beneficiários */}
      {Object.keys(beneficiariesGrouped).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-600" />
            Beneficiário: Maria Pardal
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beneficiaryDocs.map((document) => (
              <div key={document.id} className="border-2 rounded-lg p-4 bg-green-50 border-green-200">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-green-100 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  
                  <h5 className="font-medium text-gray-900 mb-2">{document.name}</h5>
                  
                  <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100 mb-3">
                    <CheckCircle className="h-4 w-4" />
                    <span>Aprovado</span>
                  </div>

                  <div className="text-green-600 text-sm">
                    ✅ Documento aprovado
                  </div>
                </div>
              </div>
            ))}
          </div>
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

export default ClientDocumentUpload;