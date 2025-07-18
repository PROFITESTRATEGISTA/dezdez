import React, { useState, useEffect } from 'react';
import { User, Shield, UserCheck, UserX, Edit, Trash2, Eye, Mail, Phone, Calendar, Filter, MoreVertical, CheckCircle, Clock, AlertTriangle, CreditCard, FileText, ArrowLeft, MessageSquare, Plus, Search, FileCheck, FilePen, UserCog, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'admin' | 'client' | 'dependent';
  userRole: string;
  status: string;
  joinDate: string;
  lastLogin: string;
  parentId?: string;
  parentName?: string;
  dependents?: any[];
}

const ClientManagement: React.FC = () => {
  const { profile } = useAuth();
  const [allUsers, setAllUsers] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDependentsModal, setShowDependentsModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'overdue' | 'admin' | 'client' | 'dependent'>('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Função auxiliar para calcular idade
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Buscar todos os usuários com RLS aplicado
        const { data: allUsersData, error: usersError } = await supabase.rpc(
          'get_all_users_with_beneficiaries',
          {},
          { count: 'exact' }
        );
          
        if (usersError) throw usersError;
        
        if (!allUsersData) {
          setAllUsers([]);
          setIsLoading(false);
          return;
        }
        
        // Processar dados para formato unificado (apenas com dados reais)
        const processedUsers = allUsersData.map((user: any) => {
          try {
            // Determinar o tipo de usuário
            let userType = 'client';
            let userRole = 'Titular';
            
            if (user.is_admin) {
              userType = 'admin';
              userRole = user.role === 'super_admin' ? 'Super Admin' : 'Admin';
            } else if (user.role === 'collaborator') {
              userType = 'admin';
              userRole = 'Colaborador';
            }
            
            // Processar beneficiários como usuários dependentes
            const dependents = (user.beneficiaries || []).map((b: any) => ({
              id: b.id,
              name: b.full_name,
              email: '',
              phone: b.phone || '',
              userType: 'dependent',
              userRole: b.relationship || 'Dependente',
              parentId: user.id,
              parentName: user.full_name,
              status: 'active',
              joinDate: b.created_at,
              age: calculateAge(b.date_of_birth)
            }));
            
            return {
              id: user.id,
              name: user.full_name || 'Usuário',
              email: user.email || '',
              phone: user.phone || '',
              userType,
              userRole,
              status: user.status || 'active',
              joinDate: user.created_at,
              lastLogin: new Date().toISOString(),
              dependents: dependents || []
            };
          } catch (err) {
            console.error('Erro ao processar usuário:', err);
            return {
              id: user.id || 'unknown',
              name: user.full_name || 'Usuário',
              email: user.email || '',
              phone: '',
              userType: 'client',
              userRole: 'Titular',
              status: 'active',
              joinDate: user.created_at || new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              dependents: []
            };
          }
        });
        
        // Adicionar dependentes como usuários separados na lista principal
        let allUsersWithDependents: any[] = [];
        processedUsers.forEach(user => {
          allUsersWithDependents.push(user);
          if (user.dependents && user.dependents.length > 0) {
            allUsersWithDependents = [...allUsersWithDependents, ...user.dependents];
          }
        });
        
        setAllUsers(allUsersWithDependents);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Falha ao carregar usuários: ' + (error instanceof Error ? error.message : String(error)));
        setAllUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, [refreshTrigger]);

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
                         
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'admin') {
        matchesStatus = user.userType === 'admin';
      } else if (statusFilter === 'client') {
        matchesStatus = user.userType === 'client';
      } else if (statusFilter === 'dependent') {
        matchesStatus = user.userType === 'dependent';
      } else if (statusFilter === 'active') {
        matchesStatus = user.status === 'active';
      } else if (statusFilter === 'pending') {
        matchesStatus = user.status === 'pending_documents' || user.status === 'pending_signature';
      } else if (statusFilter === 'overdue') {
        matchesStatus = user.status === 'overdue';
      }
    }
    
    return matchesSearch && matchesStatus;
  });

  const handleEditUserRole = (user: any) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    
    try {
      // Atualizar papel do usuário no banco de dados
      const { error } = await supabase
        .rpc('update_user_role', {
          user_id: selectedUser.id,
          new_role: selectedUser.newRole,
          is_admin_val: ['admin', 'super_admin'].includes(selectedUser.newRole)
        });
        
      if (error) throw error;
      
      // Atualizar estado local
      setAllUsers(prev => prev.map(u => 
        u.id === selectedUser.id 
          ? { 
              ...u, 
              userRole: selectedUser.newRole === 'super_admin' ? 'Super Admin' : 
                        selectedUser.newRole === 'admin' ? 'Admin' : 
                        selectedUser.newRole === 'collaborator' ? 'Colaborador' : 'Titular',
              userType: ['admin', 'super_admin', 'collaborator'].includes(selectedUser.newRole) ? 'admin' : 'client'
            } 
          : u
      ));
      
      setShowRoleModal(false);
      setSelectedUser(null);
      alert('Função do usuário atualizada com sucesso!');
      // Atualizar a lista
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Erro ao atualizar função do usuário:', error);
      alert(`Erro ao atualizar função: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleSendQuestionnaire = (clientId: string) => {
    alert(`Enviando questionário para o cliente ${clientId}`);
    // Implementação real enviaria um email com link para o questionário
  };

  const handleViewDependents = (clientId: string) => {
    setSelectedClientId(clientId);
    setShowDependentsModal(true);
  };

  const handleToggleUserStatus = (userId: string) => {
    // Encontrar o usuário
    const user = allUsers.find(u => u.id === userId);
    if (!user) {
      alert('Usuário não encontrado');
      return;
    }
    
    // Alternar status
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    // Atualizar no banco de dados
    try {
      supabase
        .rpc('update_user_status', {
          user_id: userId,
          new_status: newStatus
        })
        .then(({ error }) => {
          if (error) {
            console.error('Erro ao atualizar status:', error);
            alert(`Erro ao atualizar status: ${error.message}`);
            return;
          }
          
          // Atualizar usuário no estado
          setAllUsers(prev => 
            prev.map(u => 
              u.id === userId 
                ? { ...u, status: newStatus } 
                : u
            )
          );
          
          // Show confirmation
          alert(`Usuário ${user.name} ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso!`);
          
          // Atualizar a lista
          setRefreshTrigger(prev => prev + 1);
        });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert(`Erro ao atualizar status: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h2>
          <p className="mt-1 text-sm text-gray-500">
            Visualize e gerencie todos os usuários do sistema (clientes, dependentes e administradores)
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
            <User className="h-8 w-8 text-blue-600" />
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total de Usuários</dt>
                <dd className="text-lg font-medium text-gray-900">{allUsers.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-purple-600" />
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Administradores</dt>
                <dd className="text-lg font-medium text-gray-900">{allUsers.filter(u => u.userType === 'admin').length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <User className="h-8 w-8 text-green-600" />
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Clientes</dt>
                <dd className="text-lg font-medium text-gray-900">{allUsers.filter(u => u.userType === 'client').length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Dependentes</dt>
                <dd className="text-lg font-medium text-gray-900">{allUsers.filter(u => u.userType === 'dependent').length}</dd>
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
                placeholder="Buscar por nome, email ou ID..."
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">Todos os Usuários</option>
                <option value="admin">Administradores</option>
                <option value="client">Clientes</option>
                <option value="dependent">Dependentes</option>
                <option value="active">Usuários Ativos</option>
                <option value="pending">Usuários Pendentes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Lista de Usuários ({filteredUsers.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            user.userType === 'admin' ? 'bg-purple-100' : 
                            user.userType === 'dependent' ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                            {user.userType === 'admin' ? (
                              <Shield className="h-5 w-5 text-purple-600" />
                            ) : user.userType === 'dependent' ? (
                              <Users className="h-5 w-5 text-blue-600" />
                            ) : (
                              <User className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email || 'Sem email'}</div>
                          {user.userType === 'dependent' && (
                            <div className="text-xs text-blue-600">Dependente de: {user.parentName}</div>
                          )}
                          <div className="text-xs text-gray-400">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.userRole === 'Super Admin' ? 'bg-purple-100 text-purple-800' :
                        user.userRole === 'Admin' ? 'bg-blue-100 text-blue-800' :
                        user.userRole === 'Colaborador' ? 'bg-green-100 text-green-800' :
                        user.userType === 'dependent' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.userRole}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status === 'active' ? 'Ativo' :
                         user.status === 'inactive' ? 'Inativo' :
                         user.status === 'pending_documents' ? 'Docs Pendentes' :
                         user.status === 'pending_signature' ? 'Assinatura Pendente' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString('pt-BR') : 'Nunca'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUserRole(user)}
                            className="text-purple-600 hover:text-purple-900 flex items-center space-x-1 text-xs"
                          >
                            <UserCog className="h-3 w-3" />
                            <span>Editar Função</span>
                          </button>
                          
                          {user.userType === 'client' && (
                            <button
                              onClick={() => handleSendQuestionnaire(user.id)}
                              className="text-purple-600 hover:text-purple-900 flex items-center space-x-1 text-xs"
                            >
                              <MessageSquare className="h-3 w-3" />
                              <span>Questionário</span>
                            </button>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          {user.userType === 'client' && (
                            <button
                              onClick={() => handleViewDependents(user.id)}
                              className="text-green-600 hover:text-green-900 flex items-center space-x-1 text-xs"
                            >
                              <Users className="h-3 w-3" />
                              <span>Dependentes</span>
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} flex items-center space-x-1 text-xs`}
                          >
                            <CheckCircle className="h-3 w-3" />
                            <span>{user.status === 'active' ? 'Desativar' : 'Ativar'}</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {error ? `Erro ao carregar usuários: ${error}` : 'Nenhum usuário encontrado. Clique em "Adicionar Colaborador" para criar um novo usuário.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição de Função */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Editar Função do Usuário</h3>
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  <strong>Usuário:</strong> {selectedUser.name}
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Função atual:</strong> {selectedUser.userRole}
                </p>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Função:
                </label>
                <select
                  value={selectedUser.newRole || (
                    selectedUser.userRole === 'Super Admin' ? 'super_admin' :
                    selectedUser.userRole === 'Admin' ? 'admin' :
                    selectedUser.userRole === 'Colaborador' ? 'collaborator' : 'titular'
                  )}
                  onChange={(e) => setSelectedUser({...selectedUser, newRole: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="collaborator">Colaborador</option>
                  <option value="titular">Titular (Cliente)</option>
                  {selectedUser.userType === 'dependent' && (
                    <option value="dependent">Dependente</option>
                  )}
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleUpdateRole}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dependents Modal */}
      {showDependentsModal && selectedClientId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-green-700 text-white">
              <h3 className="text-xl font-semibold">Gerenciar Dependentes</h3>
              <button
                onClick={() => setShowDependentsModal(false)}
                className="text-white hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-900">
                  Dependentes do cliente: {allUsers.find(u => u.id === selectedClientId)?.name}
                </h4>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Adicionar Dependente</span>
                </button>
              </div>
              
              {allUsers.find(u => u.id === selectedClientId)?.dependents?.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Este cliente não possui dependentes cadastrados.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allUsers.find(u => u.id === selectedClientId)?.dependents?.map((beneficiary: any) => (
                    <div key={beneficiary.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-gray-900">{beneficiary.name}</h5>
                          <p className="text-sm text-gray-600">{beneficiary.userRole} • {beneficiary.age || '?'} anos</p>
                          <p className="text-sm text-gray-600">Telefone: {beneficiary.phone || 'Não informado'}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowDependentsModal(false)}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ClientManagement;