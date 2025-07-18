// Client data interfaces and mock data for the medical emergency plan system

export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  planType: 'monthly' | 'annual' | 'biannual';
  value: number;
  status: {
    payment: 'paid' | 'pending' | 'overdue';
    documents: 'approved' | 'pending' | 'rejected';
    contract: 'signed' | 'pending' | 'sent';
  };
  contractExpiration?: string;
  autoRenewal?: boolean;
  joinDate: string;
  isPendingPurchase?: boolean;
  paymentDate?: string;
  paymentMethod?: string;
  beneficiaries: Array<{
    id: string;
    name: string;
    relationship: string;
    age: number;
    cpf: string;
    phone: string;
    documents: {
      rg: 'approved' | 'pending' | 'rejected' | 'missing';
      cpf: 'approved' | 'pending' | 'rejected' | 'missing';
    };
  }>;
  personalData: {
    cpf: string;
    address: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
    medicalHistory: string[];
  };
  documents: {
    titular: {
      rg: 'approved' | 'pending' | 'rejected' | 'missing';
      cpf: 'approved' | 'pending' | 'rejected' | 'missing';
      proofOfAddress: 'approved' | 'pending' | 'rejected' | 'missing';
    };
  };
}

// Production data with only Pedro Pardal
export const clientsDatabase: ClientData[] = [
  {
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
      contract: 'pending' // Contract pending for signature
    },
    contractExpiration: '2025-12-15',
    autoRenewal: true,
    joinDate: '2024-01-15',
    beneficiaries: [],
    personalData: {
      cpf: '',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      },
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      },
      medicalHistory: []
    },
    documents: {
      titular: {
        rg: 'missing',
        cpf: 'missing',
        proofOfAddress: 'missing'
      }
    }
  }
];

// Credenciais simplificadas
export const ADMIN_EMAIL = 'pedropardal04@gmail.com';
export const ADMIN_PASSWORD = 'admin123';