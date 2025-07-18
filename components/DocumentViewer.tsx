import React, { useState } from 'react';
import { X, Eye, Download, FileText, User, Users, CheckCircle, AlertCircle, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface Document {
  id: string;
  type: 'rg' | 'cnh';
  fileName: string;
  uploadDate: string;
  status: 'approved' | 'pending' | 'rejected';
  personName: string;
  personType: 'titular' | 'beneficiary';
  fileUrl: string;
  rejectionReason?: string;
}

interface DocumentViewerProps {
  clientId: string;
  clientName: string;
  documents: Document[];
  onClose: () => void;
  onApproveDocument: (docId: string) => void;
  onRejectDocument: (docId: string, reason: string) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  clientId,
  clientName,
  documents,
  onClose,
  onApproveDocument,
  onRejectDocument
}) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [documentToReject, setDocumentToReject] = useState<string | null>(null);

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'rg': return 'RG';
      case 'cnh': return 'CNH';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleRejectDocument = () => {
    if (documentToReject && rejectionReason.trim()) {
      onRejectDocument(documentToReject, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason('');
      setDocumentToReject(null);
    }
  };

  const handleDownload = (document: Document) => {
    // Simula download do documento
    const link = document.createElement('a');
    link.href = document.fileUrl;
    link.download = document.fileName;
    link.click();
  };

  const titularDocuments = documents.filter(doc => doc.personType === 'titular');
  const beneficiaryDocuments = documents.filter(doc => doc.personType === 'beneficiary');

  // Agrupar documentos de beneficiários por pessoa
  const beneficiariesGrouped = beneficiaryDocuments.reduce((acc, doc) => {
    if (!acc[doc.personName]) {
      acc[doc.personName] = [];
    }
    acc[doc.personName].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-900 to-green-700 text-white">
          <div className="flex items-center space-x-4">
            <FileText className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Documentos de Identidade</h2>
              <p className="text-blue-100">Cliente: {clientName} • ID: {clientId}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex h-[calc(95vh-80px)]">
          {/* Lista de Documentos */}
          <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              {/* Documentos do Titular */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Titular: {clientName}</h3>
                </div>
                
                <div className="space-y-2">
                  {titularDocuments.map((document) => (
                    <div
                      key={document.id}
                      onClick={() => setSelectedDocument(document)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedDocument?.id === document.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{getDocumentTypeLabel(document.type)}</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                          {getStatusIcon(document.status)}
                          <span className="ml-1">
                            {document.status === 'approved' ? 'Aprovado' :
                             document.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                          </span>
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        <div>{document.fileName}</div>
                        <div>Enviado: {new Date(document.uploadDate).toLocaleDateString('pt-BR')}</div>
                      </div>
                      
                      {document.status === 'rejected' && document.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                          <strong>Motivo:</strong> {document.rejectionReason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Documentos dos Beneficiários */}
              {Object.keys(beneficiariesGrouped).length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Beneficiários</h3>
                  </div>
                  
                  {Object.entries(beneficiariesGrouped).map(([personName, docs]) => (
                    <div key={personName} className="mb-4">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">{personName}</h4>
                      <div className="space-y-2 ml-4">
                        {docs.map((document) => (
                          <div
                            key={document.id}
                            onClick={() => setSelectedDocument(document)}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedDocument?.id === document.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{getDocumentTypeLabel(document.type)}</span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                                {getStatusIcon(document.status)}
                                <span className="ml-1">
                                  {document.status === 'approved' ? 'Aprovado' :
                                   document.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                                </span>
                              </span>
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              <div>{document.fileName}</div>
                              <div>Enviado: {new Date(document.uploadDate).toLocaleDateString('pt-BR')}</div>
                            </div>
                            
                            {document.status === 'rejected' && document.rejectionReason && (
                              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                                <strong>Motivo:</strong> {document.rejectionReason}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Visualizador de Documento */}
          <div className="flex-1 flex flex-col">
            {selectedDocument ? (
              <>
                {/* Toolbar */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-semibold text-gray-900">
                      {getDocumentTypeLabel(selectedDocument.type)} - {selectedDocument.personName}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDocument.status)}`}>
                      {getStatusIcon(selectedDocument.status)}
                      <span className="ml-1">
                        {selectedDocument.status === 'approved' ? 'Aprovado' :
                         selectedDocument.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                      </span>
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setRotation(rotation - 90)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Girar"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Diminuir zoom"
                    >
                      <ZoomOut className="h-5 w-5" />
                    </button>
                    
                    <span className="text-sm text-gray-600 px-2">{zoomLevel}%</span>
                    
                    <button
                      onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Aumentar zoom"
                    >
                      <ZoomIn className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDownload(selectedDocument)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Baixar documento"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Área de Visualização */}
                <div className="flex-1 overflow-auto bg-gray-100 p-4">
                  <div className="flex justify-center">
                    <div
                      style={{
                        transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                        transformOrigin: 'center',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <img
                        src={selectedDocument.fileUrl}
                        alt={`${selectedDocument.type} - ${selectedDocument.personName}`}
                        className="max-w-full h-auto shadow-lg rounded-lg bg-white"
                        onError={(e) => {
                          // Fallback para quando a imagem não carrega
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRvY3VtZW50byBuw6NvIGRpc3BvbsOtdmVsPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Ações */}
                {selectedDocument.status === 'pending' && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Documento aguardando análise
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => {
                            setDocumentToReject(selectedDocument.id);
                            setShowRejectModal(true);
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          Rejeitar
                        </button>
                        
                        <button
                          onClick={() => onApproveDocument(selectedDocument.id)}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Aprovar Documento
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Selecione um documento para visualizar</p>
                  <p className="text-sm">Clique em um documento na lista ao lado</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Rejeição */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Rejeitar Documento
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo da rejeição:
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Descreva o motivo da rejeição..."
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                    setDocumentToReject(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleRejectDocument}
                  disabled={!rejectionReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Rejeitar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;