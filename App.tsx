import React, { useState, useEffect } from 'react';
import { BillingPeriod, CheckoutData } from './types';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { clientsDatabase } from './data/clientsDatabase';
import LocalSEO from './components/LocalSEO';
import AppLayout from './components/layout/AppLayout';
import HomePage from './components/HomePage';
import AdminPanel from './components/AdminPanel';
import ClientArea from './components/client/ClientArea';
import ClientLogin from './components/ClientLogin';
import PaymentPage from './components/PaymentPage';
import BenefitsPage from './components/BenefitsPage';
import MedicalQuestionnaire from './components/MedicalQuestionnaire';
import LeadCollection from './components/LeadCollection';
import CheckoutCalculator from './components/CheckoutCalculator';
import LocationPage from './components/LocationPages';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { AlertTriangle } from 'lucide-react';

type AppView = 'home' | 'admin' | 'client-login' | 'client-area' | 'payment' | 'benefits' | 'checkout-flow';
type CheckoutStep = 'lead-collection' | 'checkout-calculator' | 'payment' | 'complete';

const AppContent = () => {
  const { session, profile, isLoading, isAdmin, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState<BillingPeriod>('monthly');
  
  // Checkout flow state
  const [currentCheckoutStep, setCurrentCheckoutStep] = useState<CheckoutStep>('lead-collection');
  const [leadData, setLeadData] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [finalCheckoutData, setFinalCheckoutData] = useState<CheckoutData | null>(null);

  // Client session state for mock login
  const [clientSession, setClientSession] = useState<any>(null);

  // Update view based on auth state
  useEffect(() => {
    if (session && profile) {
      setCurrentView('client-area');
    }
  }, [session, profile]);

  // Mock login function
  const handleClientLogin = async (email: string, password: string) => {
    // Find user in database
    // Simplificando para usar apenas pedropardal04@gmail.com
    if (email === 'pedropardal04@gmail.com' && password === 'admin123') {
      const user = {
        id: 'CLI001',
        name: 'Pedro Pardal',
        email: 'pedropardal04@gmail.com',
        phone: '(11) 99999-0001',
        plan: 'Plano Família Premium',
        planType: 'annual',
        value: 2400.00,
        is_admin: true,
        status: {
          payment: 'paid',
          documents: 'approved',
          contract: 'pending'
        },
        contractExpiration: '2025-12-15',
        autoRenewal: true,
        joinDate: '2024-01-15',
        beneficiaries: [],
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
      
      setClientSession(user);
      setCurrentView('client-area');
      return { success: true };
    }
    throw new Error('Credenciais inválidas');
  };

  const handleClientLogout = async () => {
    try {
      await signOut();
      // Garantir que todas as variáveis de estado sejam resetadas
      setTimeout(() => {
        setClientSession(null);
        setCurrentView('home');
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    // Reset checkout flow when navigating away
    if (view === 'client-login' && clientSession) {
      // Se já estiver logado, vai direto para a área do cliente
      setCurrentView('client-area');
    } else if (view !== 'checkout-flow') {
      setCurrentCheckoutStep('lead-collection');
    }
  };

  const handleNavigateToAdmin = () => {
    // Force navigation to admin panel
    console.log('Navigating to admin panel');
    setCurrentView('admin');
  };

  const handleStartCheckout = () => {
    setCurrentView('checkout-flow');
    setCurrentCheckoutStep('lead-collection');
  };

  const handleLeadComplete = (data: { name: string; email: string; phone: string }) => {
    setLeadData(data);
    setCurrentCheckoutStep('checkout-calculator');
  };

  const handleProceedToPayment = (checkoutData: CheckoutData) => {
    setFinalCheckoutData(checkoutData);
    setCurrentCheckoutStep('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentCheckoutStep('complete');
    // Reset checkout flow after a delay
    setTimeout(() => {
      setCurrentView('home');
      setCurrentCheckoutStep('lead-collection');
      setLeadData(null);
      setFinalCheckoutData(null);
    }, 3000);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentCheckoutStep('lead-collection');
    setLeadData(null);
    setFinalCheckoutData(null);
  };

  const renderContent = () => {
    // Show loading state
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Carregando</h2>
            <p className="text-gray-600">
              Aguarde enquanto preparamos tudo para você...
            </p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return <HomePage 
          onNavigateToPayment={handleStartCheckout}
          onNavigateToClientArea={() => navigateTo('client-login')}
          onNavigateToBenefits={() => navigateTo('benefits')}
          selectedPeriod={selectedBillingPeriod}
          onPeriodChange={setSelectedBillingPeriod}
          onStartCheckout={handleStartCheckout}
        />;
      case 'admin':
        return <AdminPanel />;
      case 'client-login':
        return !session ? <ClientLogin onBack={() => navigateTo('home')} /> : <Navigate to="/client-area" />;
      case 'client-area':
        return session || clientSession ? (
          <ClientArea 
            onBack={() => navigateTo('home')}
            onLogout={handleClientLogout}
            userEmail={clientSession?.email || profile?.email}
            userType={clientSession?.is_admin || isAdmin ? 'admin' : 'client'}
          />
        ) : <Navigate to="/client-login" />;
      case 'checkout-flow':
        switch (currentCheckoutStep) {
          case 'lead-collection':
            return (
              <LeadCollection
                onComplete={handleLeadComplete}
              />
            );
          case 'checkout-calculator':
            return (
              <CheckoutCalculator
                billingPeriod={selectedBillingPeriod}
                onBack={() => setCurrentCheckoutStep('lead-collection')}
                onProceedToPayment={handleProceedToPayment}
                onBillingPeriodChange={setSelectedBillingPeriod}
                leadData={leadData}
              />
            );
          case 'payment':
            return finalCheckoutData ? (
              <PaymentPage
                checkoutData={finalCheckoutData}
                onBack={() => setCurrentCheckoutStep('checkout-calculator')}
                onPaymentComplete={handlePaymentComplete}
              />
            ) : null;
          case 'complete':
            return (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
                  <div className="text-green-600 text-6xl mb-4">✓</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Pagamento Realizado!</h2>
                  <p className="text-gray-600 mb-6">
                    Seu plano foi ativado com sucesso. Você receberá um e-mail com os detalhes.
                  </p>
                  <p className="text-sm text-gray-500">Redirecionando...</p>
                </div>
              </div>
            );
          default:
            return null;
        }
      case 'benefits':
        return <BenefitsPage onBack={() => navigateTo('home')} />;
      default:
        return <HomePage 
          onNavigateToPayment={handleStartCheckout}
          onNavigateToClientArea={() => navigateTo('client-login')}
          onNavigateToBenefits={() => navigateTo('benefits')}
          selectedPeriod={selectedBillingPeriod}
          onPeriodChange={setSelectedBillingPeriod}
          onStartCheckout={handleStartCheckout}
        />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/questionario-medico" element={
          <MedicalQuestionnaire 
            onClose={() => window.history.back()}
            onComplete={(answers) => {
              console.log('Questionário completo:', answers);
              alert('Questionário enviado com sucesso!');
              window.history.back();
            }}
          />
        } />
        <Route path="/client-area" element={
          session ? (
            <ClientArea 
              onBack={() => navigateTo('home')}
              onLogout={handleClientLogout} 
              userEmail={profile?.email}
              userType={isAdmin ? 'admin' : 'client'}
            />
          ) : clientSession ? (
            <ClientArea 
              onBack={() => navigateTo('home')}
              onLogout={handleClientLogout} 
              userEmail={clientSession.email}
              userType={clientSession.is_admin ? 'admin' : 'client'}
            />
          ) : (
            <Navigate to="/client-login" />
          )
        } />
        <Route path="/client-login" element={
          !session ? (
            <ClientLogin onBack={() => navigateTo('home')} onLogin={handleClientLogin} />
          ) : (
            <Navigate to="/client-area" />
          )
        } />
        <Route path="/admin" element={
          isAdmin || (clientSession && clientSession.is_admin) ? (
            <AdminPanel />
          ) : (session || clientSession) ? (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
                <div className="text-red-500 mx-auto mb-4">
                  <AlertTriangle className="h-12 w-12 mx-auto" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Restrito</h2>
                <p className="text-gray-600 mb-6">
                  Você não tem permissão para acessar o painel administrativo.
                  <div className="mt-2 text-sm text-gray-600">
                    Usuário: {profile?.email || clientSession?.email || "Desconhecido"}
                  </div>
                </p>
                <button
                  onClick={() => window.location.href = '/client-area'}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Voltar à Área do Cliente
                </button>
              </div>
            </div>
          ) : (
            <Navigate to="/client-login" />
          )
        } />
        <Route path="/" element={
          <AppLayout
            currentView={currentView}
            onNavigate={navigateTo} 
            clientSession={session ? { 
              email: profile?.email || '', 
              userType: isAdmin ? 'admin' : 'client',
              is_admin: isAdmin
            } : clientSession}
            onLogout={handleClientLogout}
          >
            {renderContent()}
            <FloatingWhatsApp />
          </AppLayout>
        } />
        <Route path="*" element={
          <Navigate to="/" />
        } />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
      <LocalSEO 
        businessName="Dez Emergências Médicas"
        streetAddress="Av. Paulista, 1000"
        addressLocality="São Paulo"
        addressRegion="SP"
        postalCode="01310-100"
        phoneNumber="0800-123-4567"
        description="Plano de assistência médica de urgência e emergência 24h. Sua família protegida com o melhor atendimento médico na cidade de São Paulo e Grande SP."
      />
    </AuthProvider>
  );
};

export default App;