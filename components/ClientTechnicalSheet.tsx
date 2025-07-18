import React, { useState } from 'react';
import { X, User, MapPin, Heart, Users, FileText, Edit, Save, Mail, Share, MessageSquare, Download, Eye, CheckCircle, AlertCircle, Phone, Calendar, Shield } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  planType: 'monthly' | 'annual' | 'biannual';
  value: number;
  status: {
    payment: 'paid' | 'pending' | 'overdue';
    documents: 'approved' | 'pending' | 'rejected';
    contract: 'signed' | 'pending' | 'sent';
  };
  contractExpiration: string;
  autoRenewal: boolean;
  joinDate: string;
  beneficiaries: Array<{
    id: string;
    name: string;
    relationship: string;
    age: number;
    cpf: string;
    phone: string;
    documents: {
      rg: 'approved' | 'pending' | 'rejected';
      cpf: 'approved' | 'pending' | 'rejected';
    };
  }>;
  personalData: {
    cpf: string;
    address: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
    medicalHistory: string[];
  };
}

interface ClientTechnicalSheetProps {
  client: Client;
  onClose: () => void;
  onSendBilling: (clientId: string) => void;
  onApproveDocument: (clientId: string, docType: string) => void;
  onSendContract: (clientId: string) => void;
  onAddBeneficiary: (clientId: string) => void;
  onSendQuestionnaire: (clientId: string) => void;
}

const ClientTechnicalSheet: React.FC<ClientTechnicalSheetProps> = ({
  client,
  onClose,
  onSendBilling,
  onApproveDocument,
  onSendContract,
  onAddBeneficiary,
  onSendQuestionnaire
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Client>(client);
  const [activeSection, setActiveSection] = useState<'personal' | 'address' | 'emergency' | 'medical' | 'beneficiaries' | 'contract'>('personal');

  const handleSave = () => {
    // Em produção, salvaria via API
    console.log('Dados atualizados:', editedClient);
    alert('Dados salvos com sucesso!');
    setIsEditing(false);
  };

  const handleShareByEmail = () => {
    const clientData = {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      plan: client.plan,
      value: client.value,
      status: client.status,
      contractExpiration: client.contractExpiration,
      beneficiaries: client.beneficiaries,
      personalData: client.personalData
    };

    const emailBody = `
Ficha Técnica do Cliente - ${client.name}

DADOS PESSOAIS:
- Nome: ${client.name}
- CPF: ${client.personalData.cpf}
- Email: ${client.email}
- Telefone: ${client.phone}

ENDEREÇO:
${client.personalData.address.street}, ${client.personalData.address.number}
${client.personalData.address.complement ? client.personalData.address.complement + '\n' : ''}${client.personalData.address.neighborhood}
${client.personalData.address.city}/${client.personalData.address.state}
CEP: ${client.personalData.address.zipCode}

CONTATO DE EMERGÊNCIA:
- Nome: ${client.personalData.emergencyContact.name}
- Telefone: ${client.personalData.emergencyContact.phone}
- Parentesco: ${client.personalData.emergencyContact.relationship}

PLANO:
- Tipo: ${client.plan} (${client.planType})
- Valor: R$ ${client.value.toFixed(2).replace('.', ',')}
- Expiração: ${new Date(client.contractExpiration).toLocaleDateString('pt-BR')}

BENEFICIÁRIOS (${client.beneficiaries.length}):
${client.beneficiaries.map(b => `- ${b.name} (${b.relationship}, ${b.age} anos) - ${b.phone}`).join('\n')}

HISTÓRICO MÉDICO:
${client.personalData.medicalHistory.join(', ')}

---
Dados exportados em ${new Date().toLocaleString('pt-BR')}
    `.trim();

    const subject = `Ficha Técnica - ${client.name} (${client.id})`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink);
  };

  const handleDownloadJSON = () => {
    const clientData = {
      exportDate: new Date().toISOString(),
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        plan: client.plan,
        planType: client.planType,
        value: client.value,
        status: client.status,
        contractExpiration: client.contractExpiration,
        autoRenewal: client.autoRenewal,
        joinDate: client.joinDate,
        beneficiaries: client.beneficiaries,
        personalData: client.personalData
      }
    };

    const dataStr = JSON.stringify(clientData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `cliente_${client.id}_${client.name.replace(/\s+/g, '_').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getExpirationStatus = (expirationDate: string) => {
    const today = new Date();
    const expiration = new Date(expirationDate);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'expired', days: Math.abs(diffDays), color: 'text-red-600', bgColor: 'bg-red-50' };
    if (diffDays <= 30) return { status: 'expiring', days: diffDays, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { status: 'active', days: diffDays, color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const expStatus = getExpirationStatus(client.contractExpiration);

  // Funções corrigidas para os botões funcionarem
  const handleApproveDocuments = async () => {
    try {
      await onApproveDocument(client.id, 'all');
      alert('Todos os documentos foram aprovados com sucesso!');
    } catch (error) {
      alert('Erro ao aprovar documentos. Tente novamente.');
    }
  };

  const handleSendContractAction = async () => {
    try {
      await onSendContract(client.id);
      alert('Contrato enviado por email para assinatura!');
    } catch (error) {
      alert('Erro ao enviar contrato. Tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-900 to-green-700 text-white">
          <div className="flex items-center space-x-4">
            <User className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <p className="text-blue-100">ID: {client.id} • {client.plan}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShareByEmail}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
              title="Compartilhar por email"
            >
              <Mail className="h-5 w-5" />
            </button>
            
            <button
              onClick={handleDownloadJSON}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
              title="Baixar JSON"
            >
              <Download className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
              title={isEditing ? "Cancelar edição" : "Editar dados"}
            >
              {isEditing ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
            </button>
            
            {isEditing && (
              <button
                onClick={handleSave}
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                title="Salvar alterações"
              >
                <Save className="h-5 w-5" />
              </button>
            )}
            
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-80px)]">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection('personal')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === 'personal' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="h-5 w-5" />
                <span>Dados Pessoais</span>
              </button>
              
              <button
                onClick={() => setActiveSection('address')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === 'address' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MapPin className="h-5 w-5" />
                <span>Endereço</span>
              </button>
              
              <button
                onClick={() => setActiveSection('emergency')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === 'emergency' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Phone className="h-5 w-5" />
                <span>Contato de Emergência</span>
              </button>
              
              <button
                onClick={() => setActiveSection('medical')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === 'medical' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Heart className="h-5 w-5" />
                <span>Histórico Médico</span>
              </button>
              
              <button
                onClick={() => setActiveSection('beneficiaries')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === 'beneficiaries' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Beneficiários ({client.beneficiaries.length})</span>
              </button>
              
              <button
                onClick={() => setActiveSection('contract')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === 'contract' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>Status do Contrato</span>
              </button>
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 space-y-2">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Ações Rápidas</h3>
              
              <button
                onClick={() => onSendBilling(client.id)}
                className="w-full bg-orange-600 text-white py-2 px-3 rounded-lg hover:bg-orange-700 transition-colors text-sm flex items-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Enviar Cobrança</span>
              </button>
              
              {client.status.documents === 'pending' && (
                <button
                  onClick={handleApproveDocuments}
                  className="w-full bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Aprovar Documentos</span>
                </button>
              )}
              
              {(client.status.documents === 'approved' && client.status.contract === 'pending') && (
                <button
                  onClick={handleSendContractAction}
                  className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Enviar Contrato</span>
                </button>
              )}
              
              <button
                onClick={() => onSendContract(client.id)}
                className="w-full bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors text-sm flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Baixar Contrato</span>
              </button>
              
              <button
                onClick={() => onSendQuestionnaire(client.id)}
                className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center space-x-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Enviar Questionário</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Personal Data Section */}
            {activeSection === 'personal' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Dados Pessoais
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedClient.name}
                          onChange={(e) => setEditedClient({...editedClient, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{client.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CPF:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedClient.personalData.cpf}
                          onChange={(e) => setEditedClient({
                            ...editedClient,
                            personalData: {...editedClient.personalData, cpf: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{client.personalData.cpf}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedClient.email}
                          onChange={(e) => setEditedClient({...editedClient, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{client.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone:</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedClient.phone}
                          onChange={(e) => setEditedClient({...editedClient, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{client.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Address Section */}
            {activeSection === 'address' && (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Endereço
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rua:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedClient.personalData.address.street}
                          onChange={(e) => setEditedClient({
                            ...editedClient,
                            personalData: {
                              ...editedClient.personalData,
                              address: {...editedClient.personalData.address, street: e.target.value}
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{client.personalData.address.street}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedClient.personalData.address.number}
                          onChange={(e) => setEditedClient({
                            ...editedClient,
                            personalData: {
                              ...editedClient.personalData,
                              address: {...editedClient.personalData.address, number: e.target.value}
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{client.personalData.address.number}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Complemento:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedClient.personalData.address.complement || ''}
                          onChange={(e) => setEditedClient({
                            ...editedClient,
                            personalData: {
                              ...editedClient.personalData,
                              address: {...editedClient.personalData.address, complement: e.target.value}
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{client.personalData.address.complement || '-'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bairro:</label>
                      <p className="text-gray-900 font-medium">{client.personalData.address.neighborhood}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cidade:</label>
                      <p className="text-gray-900 font-medium">{client.personalData.address.city}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
                      <p className="text-gray-900 font-medium">{client.personalData.address.state}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CEP:</label>
                      <p className="text-gray-900 font-medium">{client.personalData.address.zipCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Emergency Contact Section */}
            {activeSection === 'emergency' && (
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Contato de Emergência
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedClient.personalData.emergencyContact.name}
                          onChange={(e) => setEditedClient({
                            ...editedClient,
                            personalData: {
                              ...editedClient.personalData,
                              emergencyContact: {...editedClient.personalData.emergencyContact, name: e.target.value}
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{client.personalData.emergencyContact.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone:</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedClient.personalData.emergencyContact.phone}
                          onChange={(e) => setEditedClient({
                            ...editedClient,
                            personalData: {
                              ...editedClient.personalData,
                              emergencyContact: {...editedClient.personalData.emergencyContact, phone: e.target.value}
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{client.personalData.emergencyContact.phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parentesco:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedClient.personalData.emergencyContact.relationship}
                          onChange={(e) => setEditedClient({
                            ...editedClient,
                            personalData: {
                              ...editedClient.personalData,
                              emergencyContact: {...editedClient.personalData.emergencyContact, relationship: e.target.value}
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{client.personalData.emergencyContact.relationship}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Medical History Section */}
            {activeSection === 'medical' && (
              <div className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Histórico Médico
                  </h3>
                  
                  <div className="space-y-3">
                    {client.personalData.medicalHistory.map((condition, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-900">{condition}</span>
                      </div>
                    ))}
                    
                    {client.personalData.medicalHistory.length === 0 && (
                      <p className="text-gray-500 italic">Nenhum histórico médico informado</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Beneficiaries Section */}
            {activeSection === 'beneficiaries' && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-yellow-900 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Beneficiários ({client.beneficiaries.length})
                    </h3>
                    <button
                      onClick={() => onAddBeneficiary(client.id)}
                      className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                    >
                      Adicionar Beneficiário
                    </button>
                  </div>
                  
                  {client.beneficiaries.length > 0 ? (
                    <div className="space-y-4">
                      {client.beneficiaries.map((beneficiary) => (
                        <div key={beneficiary.id} className="bg-white border border-yellow-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">{beneficiary.name}</h4>
                              <div className="space-y-1 text-sm">
                                <p><span className="text-gray-600">Parentesco:</span> {beneficiary.relationship}</p>
                                <p><span className="text-gray-600">Idade:</span> {beneficiary.age} anos</p>
                                <p><span className="text-gray-600">CPF:</span> {beneficiary.cpf}</p>
                                <p><span className="text-gray-600">Telefone:</span> {beneficiary.phone}</p>
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Status dos Documentos:</h5>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">RG:</span>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    beneficiary.documents.rg === 'approved' ? 'bg-green-100 text-green-800' :
                                    beneficiary.documents.rg === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {beneficiary.documents.rg === 'approved' ? 'OK' :
                                     beneficiary.documents.rg === 'pending' ? 'Pendente' : 'Rejeitado'}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">CPF:</span>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    beneficiary.documents.cpf === 'approved' ? 'bg-green-100 text-green-800' :
                                    beneficiary.documents.cpf === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {beneficiary.documents.cpf === 'approved' ? 'OK' :
                                     beneficiary.documents.cpf === 'pending' ? 'Pendente' : 'Rejeitado'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-center py-8">
                      Nenhum beneficiário cadastrado
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Contract Status Section */}
            {activeSection === 'contract' && (
              <div className="space-y-6">
                <div className={`border rounded-xl p-6 ${expStatus.bgColor} border-opacity-50`}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Status do Contrato
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          client.status.contract === 'signed' ? 'bg-green-100 text-green-800' :
                          client.status.contract === 'sent' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {client.status.contract === 'signed' ? 'Assinado' :
                           client.status.contract === 'sent' ? 'Enviado' : 'Pendente'}
                        </span>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiração:</label>
                        <p className="text-gray-900 font-medium">
                          {new Date(client.contractExpiration).toLocaleDateString('pt-BR')}
                        </p>
                        <p className={`text-sm ${expStatus.color}`}>
                          {expStatus.status === 'expired' ? `Expirado há ${expStatus.days} dias` :
                           expStatus.status === 'expiring' ? `Expira em ${expStatus.days} dias` :
                           `${expStatus.days} dias restantes`}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Auto-renovação:</label>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            client.autoRenewal ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                          <span className="text-gray-900">
                            {client.autoRenewal ? 'Ativa' : 'Inativa'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plano:</label>
                        <p className="text-gray-900 font-medium">{client.plan}</p>
                        <p className="text-sm text-gray-600 capitalize">{client.planType}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor:</label>
                        <p className="text-gray-900 font-medium text-lg">
                          R$ {client.value.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Membro desde:</label>
                        <p className="text-gray-900 font-medium">
                          {new Date(client.joinDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientTechnicalSheet;