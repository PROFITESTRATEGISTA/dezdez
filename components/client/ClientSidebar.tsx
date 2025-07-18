import React from 'react';
import { Shield, User, Users, FileText, CreditCard, Heart, LogOut, Settings } from 'lucide-react';

interface ClientSidebarProps {
  user: any;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onNavigateToAdmin: () => void;
  onLogout: () => void;
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({
  user,
  activeSection,
  onSectionChange,
  onNavigateToAdmin,
  onLogout
}) => {
  // Verificar se o usuário é admin
  const isAdmin = user?.is_admin === true || (user?.email === 'pedropardal04@gmail.com');
  
  console.log('ClientSidebar - user:', user);
  console.log('ClientSidebar - isAdmin:', isAdmin);
  
  const menuItems = [
    { id: 'dashboard', label: 'Meu Plano', icon: Shield },
    { id: 'profile', label: 'Meu Perfil', icon: User },
    { id: 'beneficiaries', label: 'Beneficiários', icon: Users },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'contract', label: 'Contrato', icon: FileText },
    { id: 'billing', label: 'Pagamentos', icon: CreditCard },
    { id: 'medical', label: 'Histórico Médico', icon: Heart },
    { id: 'cards', label: 'Carteirinhas', icon: FileText }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto z-40">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 text-center">
          <div className="flex flex-col items-center space-y-3">
            <img 
              src="https://i.postimg.cc/G3jZ48Kd/image-1.png" 
              alt="Logo" 
              className="h-12 w-auto"
            />
            <div className="mt-3 text-gray-900 font-bold text-xl">
              Olá, {user?.name || 'Usuário'}
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto space-y-1">
          <div className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-4 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-red-100 text-red-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            {isAdmin && (
              <>
                <div className="mt-6 mb-2 px-3">
                  <div className="h-px bg-gray-200 my-2"></div>
                  <p className="text-xs text-gray-500 mb-2">Acesso Administrativo</p>
                </div>
                <button
                  onClick={() => {
                    console.log('Clicou no botão de admin');
                    onNavigateToAdmin();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium shadow-md"
                >
                  <Settings className="h-5 w-5" />
                  <span>Painel Administrativo</span>
                </button>
              </>
            )}
          </div>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientSidebar;