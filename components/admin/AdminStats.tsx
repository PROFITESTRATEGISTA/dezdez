import React from 'react';
import { Users, UserCheck, Shield, CreditCard, FileText, AlertTriangle } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    totalAdmins: number;
    activeAdmins: number;
    superAdmins: number;
    collaborators: number;
    pendingBilling: number;
    pendingSignatures: number;
    pendingDocuments: number;
    totalClients: number;
  };
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  const statCards = [
    { title: 'Total Admins', value: stats.totalAdmins, icon: Users, color: 'text-blue-600' },
    { title: 'Ativos', value: stats.activeAdmins, icon: UserCheck, color: 'text-green-600' },
    { title: 'Super Admins', value: stats.superAdmins, icon: Shield, color: 'text-purple-600' },
    { title: 'Colaboradores', value: stats.collaborators, icon: Users, color: 'text-orange-600' },
    { title: 'Cobranças Pendentes', value: stats.pendingBilling, icon: CreditCard, color: 'text-orange-600' },
    { title: 'Assinaturas Pendentes', value: stats.pendingSignatures, icon: FileText, color: 'text-blue-600' },
    { title: 'Documentos Pendentes', value: stats.pendingDocuments, icon: AlertTriangle, color: 'text-yellow-600' },
    { title: 'Total de Clientes', value: stats.totalClients, icon: Users, color: 'text-green-600' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                  <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStats;