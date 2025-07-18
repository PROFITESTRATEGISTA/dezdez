import React from 'react';
import { FileText, CheckCircle, Clock, Eye, Download, User, Users } from 'lucide-react';

interface ClientDocumentsProps {
  user: any;
}

const ClientDocuments: React.FC<ClientDocumentsProps> = ({ user }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDocument = (docType: string, personName: string) => {
    // Simula visualização do documento
    alert(`Visualizando documento: ${docType} de ${personName}`);
  };

  const handleDownloadDocument = (docType: string, personName: string) => {
    // Simula download do documento
    alert(`Baixando documento: ${docType} de ${personName}`);
  };
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Documentos</h2>
      
      {/* Progresso dos Documentos */}
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
            <Clock className="h-4 w-4 text-red-600" />
            <span>0 Rejeitados</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-blue-600" />
          Titular: Pedro Pardal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">RG</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              Aprovado
            </span>
            
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => handleViewDocument('rg', 'Pedro Pardal')}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              >
                <Eye className="h-3 w-3" />
                <span>Ver</span>
              </button>
              <button
                onClick={() => handleDownloadDocument('rg', 'Pedro Pardal')}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors"
              >
                <Download className="h-3 w-3" />
                <span>Baixar</span>
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">CPF</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              Aprovado
            </span>
            
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => handleViewDocument('cpf', 'Pedro Pardal')}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              >
                <Eye className="h-3 w-3" />
                <span>Ver</span>
              </button>
              <button
                onClick={() => handleDownloadDocument('cpf', 'Pedro Pardal')}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors"
              >
                <Download className="h-3 w-3" />
                <span>Baixar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-green-600" />
          Beneficiário: Maria Pardal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">RG</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              Aprovado
            </span>
            
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => handleViewDocument('rg', 'Maria Pardal')}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              >
                <Eye className="h-3 w-3" />
                <span>Ver</span>
              </button>
              <button
                onClick={() => handleDownloadDocument('rg', 'Maria Pardal')}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors"
              >
                <Download className="h-3 w-3" />
                <span>Baixar</span>
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">CPF</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              Aprovado
            </span>
            
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => handleViewDocument('cpf', 'Maria Pardal')}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              >
                <Eye className="h-3 w-3" />
                <span>Ver</span>
              </button>
              <button
                onClick={() => handleDownloadDocument('cpf', 'Maria Pardal')}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors"
              >
                <Download className="h-3 w-3" />
                <span>Baixar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
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

export default ClientDocuments;