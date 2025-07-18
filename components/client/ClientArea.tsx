import React, { useState, useEffect } from 'react';
import ClientSidebar from './ClientSidebar';
import ClientContent from './ClientContent';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../ui/LoadingSpinner';

import { Menu } from 'lucide-react';
import { clientsDatabase } from '../../data/clientsDatabase';

interface ClientAreaProps {
  userEmail?: string | null;
  userType?: 'admin' | 'client' | null;
  onBack: () => void;
  onLogout: () => void;
}

const ClientArea: React.FC<ClientAreaProps> = ({ userEmail, userType, onBack, onLogout }) => {
  const { profile, isAdmin, user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        
        // Verificar se é o usuário especial
        if (userEmail === 'pedropardal04@gmail.com' || profile?.email === 'pedropardal04@gmail.com') {
          // Usar dados mockados para este usuário específico
          const mockUser = {
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
          
          setUserProfile(mockUser);
        } else {
          // Para outros usuários, use dados do Supabase ou dados mockados
          const mockUser = clientsDatabase[0];
          const updatedUser = {
            ...mockUser,
            email: userEmail || profile?.email || mockUser.email,
            is_admin: userType === 'admin' || isAdmin
          };
          
          setUserProfile(updatedUser);
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        setError('Erro ao carregar perfil do usuário');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfile();
  }, [profile, userEmail, userType, isAdmin]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white p-2 rounded-lg shadow-md text-blue-900"
        >
          <Menu className="h-6 w-6 text-blue-900" />
        </button>
      </div>
      
      {/* Mobile Sidebar - Conditionally rendered */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" 
             onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-64 h-full bg-white overflow-y-auto" 
               onClick={e => e.stopPropagation()}>
            <ClientSidebar 
              user={userProfile}
              activeSection={activeSection}
              onSectionChange={(section) => {
                setActiveSection(section);
                setIsMobileMenuOpen(false);
              }}
              onNavigateToAdmin={() => {
                console.log('Navegando para admin-panel');
                setActiveSection('admin-panel');
                setIsMobileMenuOpen(false);
              }}
              onLogout={onLogout}
            />
          </div>
        </div>
      )}
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <ClientSidebar 
          user={userProfile}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onNavigateToAdmin={() => {
            console.log('Navegando para admin-panel');
            setActiveSection('admin-panel');
          }}
          onLogout={onLogout}
        />
      </div>
      
      <ClientContent 
        user={userProfile}
        activeSection={activeSection}
        userType={isAdmin ? 'admin' : 'client'}
      />
    </div>
  );
};

export default ClientArea;