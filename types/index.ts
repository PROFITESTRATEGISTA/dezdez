export interface Plan {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  coverage: string[];
}

export interface PricingTier {
  ageRange: string;
  minAge: number;
  maxAge: number;
  price: number;
}

export interface Optional {
  id: string;
  name: string;
  description: string;
  price: number;
  free?: boolean;
  included?: boolean;
}

export interface Beneficiary {
  id: string;
  name: string;
  age: number;
  relationship: string;
  cpf?: string;
  phone?: string;
}

export interface CheckoutData {
  mainUser: {
    name: string;
    age: number;
    email: string;
    phone: string;
  };
  beneficiaries: Beneficiary[];
  selectedPlan: string;
  billingPeriod: 'monthly' | 'annual' | 'biannual';
  selectedOptionals: string[];
  totalAmount: number;
  autoDebit?: boolean;
}

export type BillingPeriod = 'monthly' | 'annual' | 'biannual';

export interface DocumentAnalysis {
  isValid: boolean;
  documentType: string;
  confidence: number;
  issues?: string[];
  suggestions?: string[];
}

// Novos tipos para o sistema administrativo
export interface AdminClient {
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
  contractExpiration: string;
  autoRenewal: boolean;
  joinDate: string;
  beneficiaries: Array<{
    id: string;
    name: string;
    relationship: string;
    age: number;
    cpf: string;
    phone: string;
    documents: {
      rg: 'approved' | 'pending' | 'rejected';
      cpf: 'approved' | 'pending' | 'rejected';
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
}

export interface QuestionnaireData {
  clientId: string;
  responses: {
    [questionId: string]: string | string[] | number | boolean;
  };
  completedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}