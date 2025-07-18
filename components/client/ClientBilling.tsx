import React from 'react';
import { CreditCard, CheckCircle, Calendar } from 'lucide-react';

interface ClientBillingProps {
  user: any;
}

const ClientBilling: React.FC<ClientBillingProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamentos e Cobrança</h2>
      
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Status do Pagamento</h3>
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <span className="text-green-600 font-medium">Pagamento em Dia</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Valor Mensal</label>
            <p className="text-2xl font-bold text-gray-900">R$ {(user.value/12).toFixed(2)}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Próximo Vencimento</label>
            <p className="font-medium">{user.contractExpiration}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg font-semibold mb-4">Histórico de Pagamentos</h3>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-green-50 rounded gap-2">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Dezembro 2024</span>
            </div>
            <span className="text-green-600 font-medium">R$ {(user.value/12).toFixed(2)}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-green-50 rounded gap-2">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Janeiro 2025</span>
            </div>
            <span className="text-green-600 font-medium">R$ {(user.value/12).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientBilling;