import React from 'react';
import { Menu, X, Shield, FileText, Users, LogOut } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  clientSession: any;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onToggle, currentView, onNavigate, clientSession, onLogout }) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: Shield },
    { id: 'benefits', label: 'Benefícios', icon: FileText },
    { id: 'client-login', label: 'Área do Cliente', icon: Users },
  ];

  return (
    <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <img 
            src="https://i.postimg.cc/G3jZ48Kd/image-1.png" 
            alt="Dez Saúde" 
            className="h-6 w-auto"
          />
          <span className="font-bold text-gray-900 text-lg"></span>
        </div>
        <button onClick={onToggle} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {isOpen && (
        <div className="bg-white border-t border-gray-200 px-4 py-3 space-y-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === id ? 'bg-red-100 text-red-900' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
          {clientSession && (
            <button onClick={onLogout} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50">
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;