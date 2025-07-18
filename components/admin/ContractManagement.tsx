import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, Eye, Download, User, Users, Search, Filter, AlertTriangle, Mail, FileCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface Contract {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  planType: string;
  startDate: string;
  endDate: string;
  status: string;
  statusName: string;
  totalPrice: number;
  contractUrl?: string;
  signedAt?: string;
}

const ContractManagement: React.FC = () => {
  const { profile } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'sent' | 'signed'>('pending');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showContractViewer, setShowContractViewer] = useState(false);
  const [isSending, setIsSending] = useState<{[key: string]: boolean}>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Buscar contratos usando RPC para contornar RLS
        const { data: contractsData, error: fetchError } = await supabase.rpc(
          'get_pending_contracts',
          { status_filter: statusFilter === 'all' ? null : statusFilter },
          { count: 'exact' }
        );

        if (fetchError) throw fetchError;

        if (!contractsData) {
          setContracts([]);
          return;
        }

        // Converter dados do banco para o formato esperado pelo componente
        const formattedContracts: Contract[] = [];
        
        for (const contract of contractsData) {
          try {
            // Mapear status para nomes amigáveis
            const statusMap: {[key: string]: string} = {
              'pending': 'Pendente',
              'sent': 'Enviado',
              'signed': 'Assinado'
            };

            // Mapear tipos de plano para nomes amigáveis
            const planTypeMap: {[key: string]: string} = {
              'monthly': 'Mensal',
              'annual': 'Anual',
              'biannual': 'Bianual'
            };

            formattedContracts.push({
              id: contract.id,
              userId: contract.user_id,
              userName: contract.users?.full_name || 'Usuário',
              userEmail: contract.users?.email || '',
              planName: contract.plans?.name || 'Plano Dez Emergências',
              planType: planTypeMap[contract.plan_type] || contract.plan_type,
              startDate: contract.start_date,
              endDate: contract.end_date,
              status: contract.status || 'pending',
              statusName: statusMap[contract.status] || 'Pendente',
              totalPrice: contract.total_price || 0,
              contractUrl: contract.contract_url,
              signedAt: contract.contract_signed_at
            });
          } catch (err) {
            console.error('Erro ao processar contrato:', err, contract);
            // Continuar para o próximo contrato
          }
        }

        setContracts(formattedContracts);
      } catch (error) {
        console.error('Error fetching contracts:', error);
        setError(`Falha ao carregar contratos: ${error instanceof Error ? error.message : String(error)}`);
        setContracts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, [statusFilter, refreshTrigger]);

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'sent': return <Mail className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setShowContractViewer(true);
  };

  const handleSendContract = async (contractId: string) => {
    if (!profile?.id) return;
    
    setIsSending(prev => ({ ...prev, [contractId]: true }));
    
    try {
      // Enviar contrato usando RPC
      const { error } = await supabase.rpc(
        'send_contract_to_user',
        {
          contract_id: contractId,
          admin_id: profile.id
        }
      );
        
      if (error) throw error;
      
      // Refresh data
      setRefreshTrigger(prev => prev + 1);
      alert('Contrato enviado com sucesso!');
    } catch (error) {
      console.error('Error sending contract:', error);
      alert(`Erro ao enviar contrato: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSending(prev => ({ ...prev, [contractId]: false }));
    }
  };

  const stats = {
    total: contracts.length,
    pending: contracts.filter(d => d.status === 'pending').length,
    sent: contracts.filter(d => d.status === 'sent').length,
    signed: contracts.filter(d => d.status === 'signed').length
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contratos Pendentes</h2>
          <p className="mt-1 text-sm text-gray-500 max-w-2xl">
            Gerencie contratos que precisam ser enviados para assinatura ou que estão aguardando assinatura do cliente.
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
                <dt className="text-sm font-medium text-gray-500 truncate">Total de Contratos</dt>
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
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Enviados</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.sent}</dd>
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
                <dt className="text-sm font-medium text-gray-500 truncate">Assinados</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.signed}</dd>
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
                placeholder="Buscar por cliente ou email..."
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
                <option value="sent">Enviados</option>
                <option value="signed">Assinados</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Contratos ({filteredContracts.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts && filteredContracts.length > 0 ? (
                filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{contract.userName}</div>
                          <div className="text-sm text-gray-500">{contract.userEmail}</div>
                          <div className="text-xs text-gray-400">
                            Vigência: {new Date(contract.startDate).toLocaleDateString('pt-BR')} a {new Date(contract.endDate).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contract.planName}</div>
                      <div className="text-xs text-gray-500">{contract.planType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                        {getStatusIcon(contract.status)}
                        <span className="ml-1">
                          {contract.statusName}
                        </span>
                      </span>
                      {contract.status === 'signed' && contract.signedAt && (
                        <div className="mt-1 text-xs text-green-600">
                          Assinado em: {new Date(contract.signedAt).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(contract.totalPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {contract.contractUrl && (
                          <button
                            onClick={() => handleViewContract(contract)}
                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Ver</span>
                          </button>
                        )}

                        {contract.status === 'pending' && (
                          <button
                            onClick={() => handleSendContract(contract.id)}
                            disabled={isSending[contract.id]}
                            className="text-green-600 hover:text-green-900 flex items-center space-x-1 disabled:opacity-50"
                          >
                            {isSending[contract.id] ? (
                              <>
                                <div className="animate-spin h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full"></div>
                                <span>Enviando...</span>
                              </>
                            ) : (
                              <>
                                <Mail className="h-4 w-4" />
                                <span>Enviar</span>
                              </>
                            )}
                          </button>
                        )}

                        {contract.contractUrl && (
                          <a
                            href={contract.contractUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                          >
                            <Download className="h-4 w-4" />
                            <span>Baixar</span>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {error ? 'Erro ao carregar contratos' : 'Nenhum contrato encontrado'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Viewer Modal */}
      {showContractViewer && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Visualizar Contrato</h3>
                <p className="text-sm text-gray-500">
                  {selectedContract.planName} - {selectedContract.userName}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowContractViewer(false);
                  setSelectedContract(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {selectedContract.contractUrl ? (
                <iframe
                  src={selectedContract.contractUrl}
                  className="w-full h-[70vh] border-0"
                  title="Visualização do Contrato"
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Contrato não disponível
                  </h4>
                  <p className="text-gray-600">
                    O contrato ainda não foi gerado ou não está disponível para visualização.
                  </p>
                </div>
              )}
              
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Informações do Contrato</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><span className="text-gray-500">Cliente:</span> {selectedContract.userName}</p>
                    <p><span className="text-gray-500">Email:</span> {selectedContract.userEmail}</p>
                    <p><span className="text-gray-500">Plano:</span> {selectedContract.planName} ({selectedContract.planType})</p>
                  </div>
                  <div>
                    <p><span className="text-gray-500">Valor:</span> {formatCurrency(selectedContract.totalPrice)}</p>
                    <p><span className="text-gray-500">Início:</span> {new Date(selectedContract.startDate).toLocaleDateString('pt-BR')}</p>
                    <p><span className="text-gray-500">Término:</span> {new Date(selectedContract.endDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {selectedContract.status === 'pending' && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    handleSendContract(selectedContract.id);
                    setShowContractViewer(false);
                  }}
                  disabled={isSending[selectedContract.id]}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSending[selectedContract.id] ? 'Enviando...' : 'Enviar Contrato para Assinatura'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractManagement;