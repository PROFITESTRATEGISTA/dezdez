import React from 'react';
import { Users, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface BeneficiariesListProps {
  beneficiaries: any[];
}

const BeneficiariesList: React.FC<BeneficiariesListProps> = ({ beneficiaries }) => {
  const getDocumentStatus = (status: string) => {
    switch (status) {
      case 'approved': return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', text: 'Aprovado' };
      case 'pending': return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', text: 'Pendente' };
      default: return { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', text: 'Rejeitado' };
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 lg:hidden">Beneficiários</h1>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          Beneficiários ({beneficiaries.length})
        </h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm text-yellow-800 w-full sm:w-auto">
          <span>Entre em contato com o suporte para adicionar beneficiários</span>
        </div>
      </div>

      {beneficiaries.length > 0 ? (
        <div className="space-y-4">
          {beneficiaries.map((beneficiary) => (
            <div key={beneficiary.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{beneficiary.name}</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-500">Parentesco:</span> {beneficiary.relationship}</p>
                    <p><span className="text-gray-500">Idade:</span> {beneficiary.age} anos</p>
                    <p><span className="text-gray-500">CPF:</span> {beneficiary.cpf}</p>
                    <p><span className="text-gray-500">Telefone:</span> {beneficiary.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Status dos Documentos</h5>
                  <div className="space-y-2">
                    {Object.entries(beneficiary.documents).map(([docType, status]) => {
                      const statusInfo = getDocumentStatus(status as string);
                      const StatusIcon = statusInfo.icon;
                      return (
                        <div key={docType} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 capitalize">{docType}:</span>
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${statusInfo.color} ${statusInfo.bg}`}>
                            <StatusIcon className="h-3 w-3" />
                            <span>{statusInfo.text}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum beneficiário cadastrado</h4>
          <p className="text-gray-600 mb-4">Entre em contato com o suporte para adicionar dependentes ao seu plano.</p>
          <a href="https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20adicionar%20um%20beneficiário%20ao%20meu%20plano" 
             target="_blank" 
             rel="noopener noreferrer"
             className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-colors inline-block text-sm sm:text-base">
            Contatar Suporte via WhatsApp
          </a>
        </div>
      )}
    </div>
  );
};

export default BeneficiariesList;