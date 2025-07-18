import React, { useState } from 'react';
import { Shield, Users, FileText, CreditCard, Settings, LogOut, Menu, X } from 'lucide-react';
import { ClientData, clientsDatabase } from './data/clientsDatabase';
import HomePage from './components/HomePage';
import AdminPanel from './components/AdminPanel';
import ClientArea from './components/ClientArea';
import ClientLogin from './components/ClientLogin';
import PaymentPage from './components/PaymentPage';
import BenefitsPage from './components/BenefitsPage';

type AppView = 'home' | 'admin' | 'client-login' | 'client-area' | 'payment' | 'benefits';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [clientSession, setClientSession] = useState<ClientData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClientLogin = async (email: string, password: string) => {
    // Find user in database
    const user = clientsDatabase.find(client => client.email === email);
    
    if (user && password === 'admin123') { // Simple password check for demo
      setClientSession(user);
      setCurrentView('client-area');
      setIsMenuOpen(false);
    } else {
      throw new Error('Credenciais inválidas');
    }
  };

  const handleClientLogout = () => {
    setClientSession(null);
    setCurrentView('home');
  };

  const navigateTo = (view: AppView) => {
    setCurrentView('client-area');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  // Mock user data for demo - in production this would come from API
  const user: ClientData = {
    id: 'CLI001',
    name: 'Pedro Pardal',
    email: userEmail,
    phone: '(11) 99999-0001',
    plan: 'Plano Família Premium',
    planType: 'annual',
    value: 2400.00,
    status: {
      payment: 'paid',
      documents: 'approved',
      contract: 'pending'
    },
    contractExpiration: '2025-12-15',
    autoRenewal: true,
    joinDate: '2024-01-15',
    beneficiaries: [
      {
        id: 'BEN001',
        name: 'Maria Pardal',
        relationship: 'Esposa',
        age: 35,
        cpf: '987.654.321-00',
        phone: '(11) 99999-0002',
        documents: {
          rg: 'approved',
          cpf: 'approved'
        }
      }
    ],
    personalData: {
      cpf: '123.456.789-00',
      address: {
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      emergencyContact: {
        name: 'João Pardal',
        phone: '(11) 99999-0003',
        relationship: 'Irmão'
      },
      medicalHistory: ['Hipertensão', 'Diabetes tipo 2']
    },
    documents: {
      titular: {
        rg: 'approved',
        cpf: 'approved',
        proofOfAddress: 'approved'
      }
    }
  };

  };

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-gray-900 text-lg">MedEmergência</span>
          </div>
          
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="bg-white border-t border-gray-200 px-4 py-3 space-y-2">
            <button
              onClick={() => navigateTo('home')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === 'home' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span>Início</span>
            </button>

            <button
              onClick={() => navigateTo('benefits')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === 'benefits' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Benefícios</span>
            </button>

            <button
              onClick={() => navigateTo('client-login')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === 'client-login' || currentView === 'client-area' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Área do Cliente</span>
            </button>

            <button
              onClick={() => navigateTo('admin')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === 'admin' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Admin</span>
            </button>

            {clientSession && (
              <button
                onClick={handleClientLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-gray-900 text-xl">MedEmergência</span>
            </div>
            
            <nav className="flex items-center space-x-6">
              <button
                onClick={() => navigateTo('home')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'home' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Shield className="h-5 w-5" />
                <span>Início</span>
              </button>

              <button
                onClick={() => navigateTo('benefits')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'benefits' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>Benefícios</span>
              </button>

              <button
                onClick={() => navigateTo('client-login')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'client-login' || currentView === 'client-area' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Área do Cliente</span>
              </button>

              <button
                onClick={() => navigateTo('admin')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  currentView === 'admin' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Admin</span>
              </button>

              {clientSession && (
                <button
                  onClick={handleClientLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage 
            onNavigateToPayment={() => navigateTo('payment')}
            onNavigateToClientArea={() => navigateTo('client-login')}
            onNavigateToBenefits={() => navigateTo('benefits')}
          />
        )}

        {currentView === 'admin' && (
          <AdminPanel />
        )}

        {currentView === 'client-login' && !clientSession && (
          <ClientLogin 
            onLogin={handleClientLogin}
            onBack={() => navigateTo('home')}
          />
        )}

        {currentView === 'client-area' && clientSession && (
          <ClientArea
            userEmail={clientSession.email}
            userType={clientSession.userType}
            onBack={() => navigateTo('home')}
            onLogout={handleClientLogout}
          />
        )}

        {currentView === 'payment' && (
          <PaymentPage 
            onBack={() => navigateTo('home')}
          />
        )}

        {currentView === 'benefits' && (
          <BenefitsPage 
            onBack={() => navigateTo('home')}
          />
        )}
      </main>
    </div>
  );
};

export default App;