import React from 'react';
import { FileText, Upload } from 'lucide-react';

interface DocumentsPanelProps {
  user: any;
}

const DocumentsPanel: React.FC<DocumentsPanelProps> = ({ user }) => {
  const handleNavigateToDocuments = () => {
    // Em produção, isso seria implementado com React Router
    alert('Navegando para seção de documentos');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Documentos</h3>
        <button
          onClick={handleNavigateToDocuments}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span>Gerenciar Documentos</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">RG</h4>
            <span className="text-gray-500 text-sm">-</span>
          </div>
          <p className="text-sm text-gray-600">
            Documento de identidade
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">CPF</h4>
            <span className="text-gray-500 text-sm">-</span>
          </div>
          <p className="text-sm text-gray-600">
            Cadastro de pessoa física
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Comprovante</h4>
            <span className="text-gray-500 text-sm">-</span>
          </div>
          <p className="text-sm text-gray-600">
            Comprovante de residência
          </p>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Formatos aceitos: JPG, PNG, PDF (máximo 5MB por arquivo)
      </div>
    </div>
  );
};

export default DocumentsPanel;