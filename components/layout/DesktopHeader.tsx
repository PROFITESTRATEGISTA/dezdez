import React from 'react';
import { Shield, FileText, Users, LogOut } from 'lucide-react';

interface DesktopHeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  clientSession: any;
  onLogout: () => void;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ 
  currentView, 
  onNavigate, 
  clientSession, 
  onLogout 
}) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: Shield },
    { id: 'benefits', label: 'Benefícios', icon: FileText },
    { id: 'client-login', label: 'Área do Cliente', icon: Users }
  ];

  return (
    <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <img 
              src="https://i.postimg.cc/G3jZ48Kd/image-1.png" 
              alt="Dez Saúde" 
              className="h-8 w-auto"
            />
          </div>
          
          <nav className="flex items-center space-x-6">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                type="button"
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  currentView === id ? 'bg-red-100 text-red-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
            {clientSession && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DesktopHeader;