import React, { useState } from 'react';
import { Users, Shield, ArrowLeft } from 'lucide-react';
import DocumentManagement from './admin/DocumentManagement';
import ClientManagement from './admin/ClientManagement';
import ContractManagement from './admin/ContractManagement';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './ui/LoadingSpinner';
import AdminTabs from './admin/AdminTabs';

const AdminPanel: React.FC = () => {
  const { profile, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'documents' | 'contracts' | 'dashboard'>('users');
  const [error, setError] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <ClientManagement />;
      case 'documents':
        return <DocumentManagement />;
      case 'contracts':
        return <ContractManagement />;
      case 'dashboard':
        return (
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Dashboard em desenvolvimento
            </h3>
            <p className="text-gray-600">
              Esta funcionalidade estará disponível em breve.
            </p>
          </div>
        );
      default:
        return <ClientManagement />;
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="text-red-500 mx-auto mb-4">
            <Shield className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Restrito</h2>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar o painel administrativo.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Voltar à Página Inicial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2 text-blue-900 hover:text-blue-700">
                <ArrowLeft className="h-5 w-5" />
                <span>Voltar à Área do Cliente</span>
              </a>
              <h1 className="ml-6 text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{profile?.email || 'Usuário'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <AdminTabs 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab as any)} 
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        ) : renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;