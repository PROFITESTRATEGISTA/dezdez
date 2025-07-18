import React from 'react';
import { Shield, Users, FileText } from 'lucide-react';

interface StatusPanelProps {
  user: any;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-blue-600" />
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500">Status do Plano</p>
            <p className="text-lg font-medium text-gray-600">-</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-blue-600" />
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500">Beneficiários</p>
            <p className="text-lg font-medium text-gray-600">-</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-yellow-600" />
          <div className="ml-5">
            <p className="text-sm font-medium text-gray-500">Contrato</p>
            <p className="text-lg font-medium text-gray-600">-</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;