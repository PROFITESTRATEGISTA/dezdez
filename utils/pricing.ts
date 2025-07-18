import { pricingTiers, billingDiscounts, autoDebitDiscount } from '../data/plans';
import { BillingPeriod } from '../types';

// Preço base
export const BASE_PRICE = 59.90; 

// Re-export billingDiscounts
export const billingDiscounts = {
  monthly: 1,      // Sem desconto
  annual: 0.85,    // 15% de desconto
  biannual: 0.7    // 30% de desconto
};

export { autoDebitDiscount };

export const getPriceByAge = (age: number): number => {
  const tier = pricingTiers.find(tier => age >= tier.minAge && age <= tier.maxAge);
  return tier ? tier.price : pricingTiers[pricingTiers.length - 1].price;
};

export const getAgeRangeByAge = (age: number): string => {
  const tier = pricingTiers.find(tier => age >= tier.minAge && age <= tier.maxAge);
  return tier ? tier.ageRange : pricingTiers[pricingTiers.length - 1].ageRange;
};

export const calculateTotal = (
  userAge: number,
  beneficiariesAges: number[],
  optionalsPrices: number[],
  billingPeriod: BillingPeriod,
  autoDebit: boolean = false
): number => {
  const mainUserPrice = getPriceByAge(userAge);
  const beneficiariesTotal = beneficiariesAges.reduce((sum, age) => sum + getPriceByAge(age), 0);
  
  // Opcionais aplicados para TODAS as vidas (titular + beneficiários)
  const totalLives = 1 + beneficiariesAges.length;
  const optionalsTotal = optionalsPrices.reduce((sum, price) => sum + price, 0) * totalLives;
  
  const subtotal = mainUserPrice + beneficiariesTotal + optionalsTotal;
  const billingDiscount = billingDiscounts[billingPeriod];
  
  const total = subtotal * billingDiscount;
  
  return total;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const getDiscountPercentage = (billingPeriod: BillingPeriod): number => {
  switch (billingPeriod) {
    case 'annual': return 15;    // 15% OFF
    case 'biannual': return 30;  // 30% OFF
    default: return 0;
  }
};

export const getAnnualSavings = (): number => {
  return BASE_PRICE * 0.15 * 12; // 15% de economia por mês
};

export const getBiannualSavings = (): number => {
  return BASE_PRICE * 0.3 * 24; // 30% de economia por mês
};

export const getAutoDebitDiscount = (billingPeriod: BillingPeriod): number => {
  switch (billingPeriod) {
    case 'monthly': return 10; // 10% OFF para mensal
    case 'annual':
    case 'biannual': return 5; // 5% OFF para anual/bianual
    default: return 0;
  }
};