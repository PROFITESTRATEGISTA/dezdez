import React, { useState } from 'react';
import MobileMenu from './MobileMenu';
import DesktopHeader from './DesktopHeader';
import { Shield } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  clientSession: any;
  onLogout: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  currentView, 
  onNavigate, 
  clientSession, 
  onLogout 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!currentView) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Carregando...</h2>
            <p className="text-gray-600">
              Aguarde enquanto preparamos tudo para você.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MobileMenu 
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen(!isMenuOpen)}
        currentView={currentView}
        onNavigate={onNavigate}
        clientSession={clientSession}
        onLogout={onLogout}
      />
      <DesktopHeader 
        currentView={currentView}
        onNavigate={onNavigate}
        clientSession={clientSession}
        onLogout={onLogout}
      />
      <main className="flex-1">{children}</main>
      <footer className="bg-blue-900 text-white py-6 text-center">
        <p className="text-sm text-blue-200">© {new Date().getFullYear()} Dez Emergências Médicas. Todos direitos reservados.</p>
      </footer>
    </div>
  );
};

export default AppLayout;