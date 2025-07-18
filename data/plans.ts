import { Plan, PricingTier, Optional } from '../types';

export const plans: Plan[] = [
  {
    id: 'dez-emergencias',
    name: 'Dez Emergências',
    description: 'Proteção completa para urgência e emergência médica 24h',
    basePrice: 59.90,
    coverage: [
      'Atendimento domiciliar 24h',
      'Orientação médica por telefone',
      'Mais de 40 ocorrências de emergência',
      'Remoção em ambulância',
      'Internação em pronto socorro',
      'Suporte médico especializado',
      'Atendimento para toda família',
      'Cobertura em São Paulo e Grande SP',
      'Central de emergência 24/7',
      'Equipe médica qualificada'
    ]
  }
];

export const pricingTiers: PricingTier[] = [
  { ageRange: '0-39 anos', minAge: 0, maxAge: 39, price: 59.90 },
  { ageRange: '40-49 anos', minAge: 40, maxAge: 49, price: 69.90 },
  { ageRange: '50-59 anos', minAge: 50, maxAge: 59, price: 79.90 },
  { ageRange: '60-69 anos', minAge: 60, maxAge: 69, price: 99.90 },
  { ageRange: '70-79 anos', minAge: 70, maxAge: 79, price: 129.90 },
  { ageRange: '80+ anos', minAge: 80, maxAge: 120, price: 139.90 }
];

export const optionals: Optional[] = [
  {
    id: 'telemedicine',
    name: 'Telemedicina',
    description: 'Consultas médicas online 24h com especialistas',
    price: 9.90
  },
  {
    id: 'benefits-club',
    name: 'Clube de Benefícios',
    description: 'Descontos exclusivos em farmácias, laboratórios e mais',
    price: 0,
    free: true,
    included: true
  },
  {
    id: 'benefits-plan',
    name: 'Plano de Benefícios Premium',
    description: 'Descontos de até 80% em farmácias, laboratórios, clínicas e rede odontológica. Inclui telemedicina.',
    price: 19.90
  }
];

export const autoDebitDiscount = 0.05; // 5% desconto adicional no débito automático