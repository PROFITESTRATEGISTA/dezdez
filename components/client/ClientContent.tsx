import React from 'react';
import ClientDashboard from './ClientDashboard';
import ClientProfile from './ClientProfile';
import BeneficiariesList from './BeneficiariesList';
import ClientContract from './ClientContract';
import ClientMedical from './ClientMedical';
import ClientDocumentsUnified from './ClientDocumentsUnified';
import ClientBilling from './ClientBilling';
import ClientCards from './ClientCards';
import AdminPanel from '../AdminPanel';

interface ClientContentProps {
  user: any;
  activeSection: string;
  userType: 'admin' | 'client';
}

const ClientContent: React.FC<ClientContentProps> = ({ user, activeSection, userType }) => {
  // Simplificar a lógica de verificação de admin
  const isAdmin = userType === 'admin' || user?.is_admin === true || (user?.email === 'pedropardal04@gmail.com');
  
  console.log('ClientContent - user:', user);
  console.log('ClientContent - activeSection:', activeSection);
  console.log('ClientContent - isAdmin:', isAdmin);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <ClientDashboard user={user} />;
      case 'profile':
        return <ClientProfile user={user} />;
      case 'beneficiaries':
        return <BeneficiariesList beneficiaries={user.beneficiaries} />;
      case 'contract':
        return <ClientContract user={user} />;
      case 'medical':
        return <ClientMedical user={user} />;
      case 'documents':
        return <ClientDocumentsUnified user={user} />;
      case 'billing':
        return <ClientBilling user={user} />;
      case 'cards':
        return <ClientCards user={user} />;
      case 'admin-panel':
        if (isAdmin) {
          console.log('Renderizando AdminPanel');
          return <AdminPanel />;
        } else {
          console.log('Usuário não é admin, mostrando mensagem de acesso restrito');
          return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
                <div className="text-red-500 mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Restrito</h2>
                <p className="text-gray-600 mb-6">
                  Você não tem permissão para acessar o painel administrativo.
                  <div className="mt-2 text-sm text-gray-600">
                    Usuário: {user?.email || "Desconhecido"}
                  </div>
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Recarregar Página
                </button>
              </div>
            </div>
          );
        }
      default:
        return <ClientDashboard user={user} />;
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 mt-16 lg:mt-0 pb-24">
      {renderContent()}
    </div>
  );
};

export default ClientContent;