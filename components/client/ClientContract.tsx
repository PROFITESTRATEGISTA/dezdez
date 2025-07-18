import React from 'react';
import { FileText, AlertTriangle, CheckCircle } from 'lucide-react';

interface ClientContractProps {
  user: any;
}

const ClientContract: React.FC<ClientContractProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Status do Contrato</h2>
      
      {user.status.contract === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:space-x-3 space-y-3 sm:space-y-0">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 hidden sm:block" />
            <div className="w-full">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600 inline sm:hidden" />
                Contrato Pendente de Assinatura
              </h3>
              <p className="text-yellow-700 mb-4">
                Seus documentos foram aprovados! Agora você precisa assinar o contrato para ativar sua proteção.
              </p>
              <button className="w-full sm:w-auto bg-yellow-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-yellow-700">
                Assinar Contrato Digitalmente
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Detalhes do Contrato</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Plano</label>
            <p className="font-medium">{user.plan}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Modalidade</label>
            <p className="font-medium capitalize">{user.planType}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Valor</label>
            <p className="font-medium">R$ {user.value.toFixed(2)}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Expiração</label>
            <p className="font-medium">{user.contractExpiration}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientContract;