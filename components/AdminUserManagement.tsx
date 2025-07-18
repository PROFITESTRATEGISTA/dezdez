import React, { useState } from 'react';
import { X, User, MapPin, Heart, Users, FileText, Edit, Save, Mail, Share, MessageSquare, Download, Eye, CheckCircle, AlertCircle, Phone, Calendar, Shield, Upload, Clock, XCircle, Image } from 'lucide-react';

interface UserData {
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
  contractExpiration?: string;
  autoRenewal?: boolean;
  joinDate: string;
  isPendingPurchase?: boolean;
  paymentDate?: string;
  paymentMethod?: string;
  beneficiaries: Array<{
    id: string;
    name: string;
    relationship: string;
    age: number;
    cpf: string;
    phone: string;
    documents: {
      rg: 'approved' | 'pending' | 'rejected' | 'missing';
      cpf: 'approved' | 'pending' | 'rejected' | 'missing';
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
  documents: {
    titular: {
      rg: 'approved' | 'pending' | 'rejected' | 'missing';
      cpf: 'approved' | 'pending' | 'rejected' | 'missing';
      proofOfAddress: 'approved' | 'pending' | 'rejected' | 'missing';
    };
  };
}

interface UserProfilePanelProps {
  user: UserData;
  onClose: () => void;
  onSendBilling?: (userId: string) => void;
  onApproveDocument: (userId: string, docType: string, personId?: string) => void;
  onRejectDocument: (userId: string, docType: string, reason: string, personId?: string) => void;
  onSendContract?: (userId: string) => void;
  onAddBeneficiary?: (userId: string) => void;
  onSendQuestionnaire?: (userId: string) => void;
  onViewDocument: (userId: string, docType: string, personId?: string) => void;
}

const UserProfilePanel: React.FC<UserProfilePanelProps> = ({
  user,
  onClose,
  onSendBilling,
  onApproveDocument,
  onRejectDocument,
  onSendContract,
  onAddBeneficiary,
  onSendQuestionnaire,
  onViewDocument
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserData>(user);
  const [activeSection, setActiveSection] = useState<'personal' | 'address' | 'emergency' | 'medical' | 'beneficiaries' | 'documents' | 'contract'>('documents');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionData, setRejectionData] = useState<{docType: string, personId?: string, reason: string}>({docType: '', reason: ''});

  const handleSave = () => {
    console.log('Dados atualizados:', editedUser);
    alert('Dados salvos com sucesso!');
    setIsEditing(false);
  };

  const handleShareByEmail = () => {
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      plan: user.plan,
      value: user.value,
      status: user.status,
      isPendingPurchase: user.isPendingPurchase,
      beneficiaries: user.beneficiaries,
      personalData: user.personalData
    };

    const emailBody = `
${user.isPendingPurchase ? 'COMPRA PENDENTE' : 'FICHA TÉCNICA'} - ${user.name}

DADOS PESSOAIS:
- Nome: ${user.name}
- CPF: ${user.personalData.cpf}
- Email: ${user.email}
- Telefone: ${user.phone}

PLANO:
- Tipo: ${user.plan} (${user.planType})
- Valor: R$ ${user.value.toFixed(2).replace('.', ',')}
${user.isPendingPurchase ? `- Data Pagamento: ${user.paymentDate}` : `- Expiração: ${user.contractExpiration}`}

BENEFICIÁRIOS (${user.beneficiaries.length}):
${user.beneficiaries.map(b => `- ${b.name} (${b.relationship}, ${b.age} anos) - ${b.phone}`).join('\n')}

STATUS: ${user.isPendingPurchase ? 'AGUARDANDO APROVAÇÃO' : 'CLIENTE ATIVO'}

---
Dados exportados em ${new Date().toLocaleString('pt-BR')}
    `.trim();

    const subject = `${user.isPendingPurchase ? 'Compra Pendente' : 'Ficha Técnica'} - ${user.name} (${user.id})`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink);
  };

  const handleDownloadJSON = () => {
    const userData = {
      exportDate: new Date().toISOString(),
      type: user.isPendingPurchase ? 'pending_purchase' : 'active_client',
      user: user
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${user.isPendingPurchase ? 'compra_pendente' : 'cliente'}_${user.id}_${user.name.replace(/\s+/g, '_').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getDocumentStatus = (status: string) => {
    switch (status) {
      case 'approved': return { color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle, text: 'Aprovado' };
      case 'pending': return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock, text: user.isPendingPurchase ? 'Aguardando Análise' : 'Pendente' };
      case 'rejected': return { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle, text: 'Rejeitado' };
      case 'missing': return { color: 'text-gray-600', bg: 'bg-gray-50', icon: AlertCircle, text: 'Não Enviado' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-50', icon: AlertCircle, text: 'Desconhecido' };
    }
  };

  const handleRejectDocument = (docType: string, personId?: string) => {
    setRejectionData({ docType, personId, reason: '' });
    setShowRejectModal(true);
  };

  const confirmRejectDocument = () => {
    if (rejectionData.reason.trim()) {
      onRejectDocument(user.id, rejectionData.docType, rejectionData.reason, rejectionData.personId);
      setShowRejectModal(false);
      setRejectionData({ docType: '', reason: '' });
    }
  };

  const DocumentCard: React.FC<{
    title: string;
    status: string;
    docType: string;
    personId?: string;
    personName?: string;
  }> = ({ title, status, docType, personId, personName }) => {
    const statusInfo = getDocumentStatus(status);
    const StatusIcon = statusInfo.icon;

    return (
      <div className={`border-2 rounded-lg p-4 ${statusInfo.bg} border-opacity-50`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bg}`}>
            <StatusIcon className="h-4 w-4" />
            <span>{statusInfo.text}</span>
          </div>
        </div>

        {personName && (
          <p className="text-sm text-gray-600 mb-3">
            <strong>Pessoa:</strong> {personName}
          </p>
        )}

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewDocument(user.id, docType, personId)}
            className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Eye className="h-4 w-4" />
            <span>Visualizar</span>
          </button>

          {status === 'pending' && (
            <>
              <button
                onClick={() => onApproveDocument(user.id, docType, personId)}
                className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Aprovar</span>
              </button>

              <button
                onClick={() => handleRejectDocument(docType, personId)}
                className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <XCircle className="h-4 w-4" />
                <span>Rejeitar</span>
              </button>
            </>
          )}

          {status === 'missing' && (
            <div className="flex items-center space-x-1 px-3 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm">
              <Upload className="h-4 w-4" />
              <span>Não Enviado</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${
          user.isPendingPurchase 
            ? 'bg-gradient-to-r from-orange-600 to-red-600' 
            : 'bg-gradient-to-r from-blue-900 to-green-700'
        } text-white`}>
          <div className="flex items-center space-x-4">
            <User className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className={user.isPendingPurchase ? "text-orange-100" : "text-blue-100"}>
                {user.isPendingPurchase ? `COMPRA PENDENTE • ID: ${user.id}` : `ID: ${user.id} • ${user.plan}`}
              </p>
              {user.isPendingPurchase && (
                <p className="text-orange-200 text-sm">
                  Pagamento: {user.paymentMethod} • {user.paymentDate}
                </p>
              )}
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
                onClick={() => setActiveSection('documents')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === 'documents' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>Documentos</span>
                {user.isPendingPurchase && (
                  <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    Análise
                  </div>
                )}
              </button>

              <button
                onClick={() => setActiveSection('beneficiaries')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === 'beneficiaries' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Beneficiários ({user.beneficiaries.length})</span>
              </button>
              
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

              {!user.isPendingPurchase && (
                <button
                  onClick={() => setActiveSection('contract')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === 'contract' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="h-5 w-5" />
                  <span>Status do Contrato</span>
                </button>
              )}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 space-y-2">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Ações Rápidas</h3>
              
              {!user.isPendingPurchase && onSendBilling && (
                <button
                  onClick={() => onSendBilling(user.id)}
                  className="w-full bg-orange-600 text-white py-2 px-3 rounded-lg hover:bg-orange-700 transition-colors text-sm flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Enviar Cobrança</span>
                </button>
              )}
              
              {user.status.documents === 'pending' && (
                <button
                  onClick={() => onApproveDocument(user.id, 'all')}
                  className="w-full bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Aprovar Todos Docs</span>
                </button>
              )}
              
              {onSendContract && (user.status.documents === 'approved' && user.status.contract === 'pending') && (
                <button
                  onClick={() => onSendContract(user.id)}
                  className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Enviar Contrato</span>
                </button>
              )}
              
              {onSendQuestionnaire && (
                <button
                  onClick={() => onSendQuestionnaire(user.id)}
                  className="w-full bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center space-x-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Enviar Questionário</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Documents Section */}
            {activeSection === 'documents' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <FileText className="h-6 w-6 mr-3 text-blue-600" />
                    Documentos de Identidade
                    {user.isPendingPurchase && (
                      <span className="ml-3 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        Aguardando Análise
                      </span>
                    )}
                  </h3>
                </div>

                {/* Documentos do Titular */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Titular: {user.name}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <DocumentCard
                      title="RG"
                      status={user.documents.titular.rg}
                      docType="rg"
                      personName={user.name}
                    />
                    <DocumentCard
                      title="CPF"
                      status={user.documents.titular.cpf}
                      docType="cpf"
                      personName={user.name}
                    />
                  </div>
                </div>

                {/* Documentos dos Beneficiários */}
                {user.beneficiaries.map((beneficiary) => (
                  <div key={beneficiary.id} className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Beneficiário: {beneficiary.name}
                      <span className="ml-3 text-sm text-green-700 bg-green-100 px-2 py-1 rounded-full">
                        {beneficiary.relationship} • {beneficiary.age} anos
                      </span>
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DocumentCard
                        title="RG"
                        status={beneficiary.documents.rg}
                        docType="rg"
                        personId={beneficiary.id}
                        personName={beneficiary.name}
                      />
                      <DocumentCard
                        title="CPF"
                        status={beneficiary.documents.cpf}
                        docType="cpf"
                        personId={beneficiary.id}
                        personName={beneficiary.name}
                      />
                    </div>
                  </div>
                ))}

                {user.beneficiaries.length === 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Nenhum beneficiário cadastrado
                    </h4>
                    <p className="text-gray-600">
                      Este {user.isPendingPurchase ? 'cliente' : 'usuário'} não possui beneficiários associados.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Beneficiaries Section */}
            {activeSection === 'beneficiaries' && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-yellow-900 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Beneficiários ({user.beneficiaries.length})
                    </h3>
                    {onAddBeneficiary && !user.isPendingPurchase && (
                      <button
                        onClick={() => onAddBeneficiary(user.id)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                      >
                        Adicionar Beneficiário
                      </button>
                    )}
                  </div>
                  
                  {user.beneficiaries.length > 0 ? (
                    <div className="space-y-4">
                      {user.beneficiaries.map((beneficiary) => (
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
                                    beneficiary.documents.rg === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {beneficiary.documents.rg === 'approved' ? 'Aprovado' :
                                     beneficiary.documents.rg === 'pending' ? (user.isPendingPurchase ? 'Aguardando' : 'Pendente') :
                                     beneficiary.documents.rg === 'rejected' ? 'Rejeitado' : 'Não Enviado'}
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">CPF:</span>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    beneficiary.documents.cpf === 'approved' ? 'bg-green-100 text-green-800' :
                                    beneficiary.documents.cpf === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    beneficiary.documents.cpf === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {beneficiary.documents.cpf === 'approved' ? 'Aprovado' :
                                     beneficiary.documents.cpf === 'pending' ? (user.isPendingPurchase ? 'Aguardando' : 'Pendente') :
                                     beneficiary.documents.cpf === 'rejected' ? 'Rejeitado' : 'Não Enviado'}
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
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{user.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CPF:</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedUser.personalData.cpf}
                          onChange={(e) => setEditedUser({
                            ...editedUser,
                            personalData: {...editedUser.personalData, cpf: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{user.personalData.cpf}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedUser.email}
                          onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{user.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone:</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedUser.phone}
                          onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{user.phone}</p>
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
                      <p className="text-gray-900 font-medium">{user.personalData.address.street}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número:</label>
                      <p className="text-gray-900 font-medium">{user.personalData.address.number}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Complemento:</label>
                      <p className="text-gray-900 font-medium">{user.personalData.address.complement || '-'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bairro:</label>
                      <p className="text-gray-900 font-medium">{user.personalData.address.neighborhood}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cidade:</label>
                      <p className="text-gray-900 font-medium">{user.personalData.address.city}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado:</label>
                      <p className="text-gray-900 font-medium">{user.personalData.address.state}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CEP:</label>
                      <p className="text-gray-900 font-medium">{user.personalData.address.zipCode}</p>
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
                      <p className="text-gray-900 font-medium">{user.personalData.emergencyContact.name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone:</label>
                      <p className="text-gray-900 font-medium">{user.personalData.emergencyContact.phone}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parentesco:</label>
                      <p className="text-gray-900 font-medium">{user.personalData.emergencyContact.relationship}</p>
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
                    {user.personalData.medicalHistory.map((condition, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-900">{condition}</span>
                      </div>
                    ))}
                    
                    {user.personalData.medicalHistory.length === 0 && (
                      <p className="text-gray-500 italic">Nenhum histórico médico informado</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Contract Status Section */}
            {activeSection === 'contract' && !user.isPendingPurchase && (
              <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Status do Contrato
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.status.contract === 'signed' ? 'bg-green-100 text-green-800' :
                          user.status.contract === 'sent' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status.contract === 'signed' ? 'Assinado' :
                           user.status.contract === 'sent' ? 'Enviado' : 'Pendente'}
                        </span>
                      </div>
                      
                      {user.contractExpiration && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiração:</label>
                          <p className="text-gray-900 font-medium">
                            {new Date(user.contractExpiration).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}
                      
                      {user.autoRenewal !== undefined && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Auto-renovação:</label>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              user.autoRenewal ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                            <span className="text-gray-900">
                              {user.autoRenewal ? 'Ativa' : 'Inativa'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plano:</label>
                        <p className="text-gray-900 font-medium">{user.plan}</p>
                        <p className="text-sm text-gray-600 capitalize">{user.planType}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valor:</label>
                        <p className="text-gray-900 font-medium text-lg">
                          R$ {user.value.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Membro desde:</label>
                        <p className="text-gray-900 font-medium">
                          {new Date(user.joinDate).toLocaleDateString('pt-BR')}
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

      {/* Reject Document Modal */}
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
                  value={rejectionData.reason}
                  onChange={(e) => setRejectionData({...rejectionData, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Descreva o motivo da rejeição..."
                />
              </div>
              
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionData({ docType: '', reason: '' });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={confirmRejectDocument}
                  disabled={!rejectionData.reason.trim()}
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

export default UserProfilePanel;