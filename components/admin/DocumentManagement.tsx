import React, { useState, useEffect } from 'react';
import { FileText, Eye, CheckCircle, XCircle, Clock, User, Users, Search, Filter, Download, Upload, AlertTriangle, FileCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface Document {
  id: string;
  clientId: string;
  clientName: string;
  documentType: string;
  documentTypeName: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: string;
  statusName: string;
  rejectionReason?: string;
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  personType: 'titular' | 'beneficiary';
  personName: string;
  beneficiaryId?: string;
}

const DocumentManagement: React.FC = () => {
  const { profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [documentToReject, setDocumentToReject] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Buscar documentos usando RPC para contornar RLS
        const { data: documentsData, error: fetchError } = await supabase.rpc(
          'get_pending_documents_with_details',
          { status_filter: 'pending' },
          { count: 'exact' }
        );

        if (fetchError) throw fetchError;

        if (!documentsData) {
          setDocuments([]);
          return;
        }

        // Converter dados do banco para o formato esperado pelo componente
        const formattedDocuments: Document[] = [];
        
        for (const doc of documentsData) {
          try {
            // Determinar se o documento pertence a um titular ou beneficiário
            const isBeneficiary = !!doc.beneficiaries;
            const personType = isBeneficiary ? 'beneficiary' : 'titular';
            const personName = isBeneficiary 
              ? (doc.beneficiaries?.full_name || 'Beneficiário') 
              : (doc.users?.full_name || 'Usuário');
            const clientName = isBeneficiary 
              ? (doc.beneficiaries?.users?.full_name || 'Titular') 
              : (doc.users?.full_name || 'Usuário');
            const clientId = isBeneficiary ? doc.beneficiaries?.user_id : doc.users?.id;

            // Mapear status para nomes amigáveis
            const statusMap: {[key: string]: string} = {
              'pending': 'Pendente',
              'approved': 'Aprovado',
              'rejected': 'Rejeitado',
              'missing': 'Não Enviado'
            };

            // Mapear tipos de documento para nomes amigáveis
            const docTypeMap: {[key: string]: string} = {
              'rg': 'RG',
              'cpf': 'CPF',
              'proof_of_address': 'Comprovante de Residência',
              'birth_certificate': 'Certidão de Nascimento',
              'other': 'Outro'
            };

            formattedDocuments.push({
              id: doc.id,
              clientId: clientId || '',
              clientName: clientName,
              documentType: doc.document_type,
              documentTypeName: docTypeMap[doc.document_type] || doc.document_type,
              fileName: doc.file_name,
              fileUrl: doc.file_url,
              fileSize: doc.file_size || 0,
              mimeType: doc.mime_type || 'application/octet-stream',
              status: doc.status,
              statusName: statusMap[doc.status] || doc.status,
              rejectionReason: doc.rejection_reason,
              uploadedAt: doc.uploaded_at,
              reviewedAt: doc.reviewed_at,
              reviewedBy: doc.reviewed_by,
              personType: personType,
              personName: personName,
              beneficiaryId: isBeneficiary ? doc.beneficiaries?.id : undefined
            });
          } catch (err) {
            console.error('Erro ao processar documento:', err, doc);
            // Continuar para o próximo documento
          }
        }

        setDocuments(formattedDocuments);
      } catch (error) {
        console.error('Error fetching documents:', error);
        setError(`Falha ao carregar documentos: ${error instanceof Error ? error.message : String(error)}`);
        setDocuments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [refreshTrigger]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.personName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleApproveDocument = async (docId: string) => {
    if (!profile?.id) return;
    
    try {
      // Atualizar o documento usando RPC para contornar RLS
      const { error } = await supabase.rpc(
        'approve_document',
        {
          document_id: docId,
          reviewer_id: profile.id
        }
      );
        
      if (error) throw error;
      
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error approving document:', error);
      alert(`Erro ao aprovar documento: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleRejectDocument = async () => {
    if (!documentToReject || !rejectionReason.trim() || !profile?.id) return;
    
    try {
      // Atualizar o documento usando RPC para contornar RLS
      const { error } = await supabase.rpc(
        'reject_document',
        {
          document_id: documentToReject,
          reviewer_id: profile.id,
          reason: rejectionReason
        }
      );
        
      if (error) throw error;
      
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
      setShowRejectModal(false);
      setRejectionReason('');
      setDocumentToReject(null);
    } catch (error) {
      console.error('Error rejecting document:', error);
      alert(`Erro ao rejeitar documento: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setShowDocumentViewer(true);
  };

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    approved: documents.filter(d => d.status === 'approved').length,
    rejected: documents.filter(d => d.status === 'rejected').length
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documentos Pendentes</h2>
          <p className="mt-1 text-sm text-gray-500 max-w-2xl">
            Analise e aprove documentos pendentes enviados pelos clientes. Apenas documentos que precisam de revisão são mostrados aqui.
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileCheck className="h-8 w-8 text-blue-600" />
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total de Documentos</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600 animate-pulse" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pendentes</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.pending}</dd>
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
                <dt className="text-sm font-medium text-gray-500 truncate">Aprovados</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.approved}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Rejeitados</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.rejected}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por cliente, arquivo ou pessoa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="pending">Pendentes</option>
                <option value="approved">Aprovados</option>
                <option value="rejected">Rejeitados</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Documentos ({filteredDocuments.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente / Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                  Enviado em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments && filteredDocuments.length > 0 ? (
                filteredDocuments.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            {document.personType === 'titular' ? (
                              <User className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Users className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{document.clientName}</div>
                          <div className="text-sm text-gray-500">
                            {document.personName} ({document.personType === 'titular' ? 'Titular' : 'Beneficiário'})
                          </div>
                          <div className="text-xs text-gray-400">
                            {document.fileName} • {formatFileSize(document.fileSize)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {document.documentTypeName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                        {getStatusIcon(document.status)}
                        <span className="ml-1">
                          {document.statusName}
                        </span>
                      </span>
                      {document.status === 'rejected' && document.rejectionReason && (
                        <div className="mt-1 text-xs text-red-600">
                          {document.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(document.uploadedAt).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(document.uploadedAt).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDocument(document)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Ver</span>
                        </button>

                        {document.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveDocument(document.id)}
                              className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Aprovar</span>
                            </button>

                            <button
                              onClick={() => {
                                setDocumentToReject(document.id);
                                setShowRejectModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Rejeitar</span>
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => window.open(document.fileUrl, '_blank')}
                          className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                        >
                          <Download className="h-4 w-4" />
                          <span>Baixar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {error ? 'Erro ao carregar documentos' : 'Nenhum documento encontrado'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Document Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Rejeitar Documento
                </h3>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo da rejeição:
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Descreva o motivo da rejeição do documento..."
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
                  Rejeitar Documento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentViewer && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Visualizar Documento</h3>
                <p className="text-sm text-gray-500">
                  {selectedDocument.documentTypeName} - {selectedDocument.personName}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDocumentViewer(false);
                  setSelectedDocument(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="flex justify-center">
                <img
                  src={selectedDocument.fileUrl}
                  alt={`${selectedDocument.documentTypeName} - ${selectedDocument.personName}`}
                  className="max-w-full h-auto shadow-lg rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRvY3VtZW50byBuw6NvIGRpc3BvbsOtdmVsPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              </div>
              
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Informações do Documento</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><span className="text-gray-500">Nome do arquivo:</span> {selectedDocument.fileName}</p>
                    <p><span className="text-gray-500">Tamanho:</span> {formatFileSize(selectedDocument.fileSize)}</p>
                    <p><span className="text-gray-500">Tipo:</span> {selectedDocument.documentTypeName}</p>
                  </div>
                  <div>
                    <p><span className="text-gray-500">Enviado em:</span> {new Date(selectedDocument.uploadedAt).toLocaleString('pt-BR')}</p>
                    <p><span className="text-gray-500">Status:</span> {selectedDocument.statusName}</p>
                    {selectedDocument.rejectionReason && (
                      <p><span className="text-gray-500">Motivo da rejeição:</span> {selectedDocument.rejectionReason}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedDocument.status === 'pending' && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setDocumentToReject(selectedDocument.id);
                      setShowRejectModal(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Rejeitar Documento
                  </button>
                  
                  <button
                    onClick={() => handleApproveDocument(selectedDocument.id)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Aprovar Documento
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DocumentManagement;