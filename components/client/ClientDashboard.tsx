import React from 'react';
import EmergencyPanel from './dashboard/EmergencyPanel';
import StatusPanel from './dashboard/StatusPanel';
import ServicesPanel from './dashboard/ServicesPanel';

interface ClientDashboardProps {
  user: any;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 lg:hidden">MEU PLANO</h1>
      
      {/* Painel de Emergência */}
      <EmergencyPanel />
      
      {/* Status do Plano */}
      <StatusPanel user={user} />
      
      {/* Serviços */}
      <ServicesPanel />
    </div>
  );
};

export default ClientDashboard;