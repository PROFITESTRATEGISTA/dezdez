import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Lock, Shield, MessageCircle, Smartphone, User, Mail, Phone, FileText } from 'lucide-react';
import { CheckoutData } from '../types';
import { formatCurrency } from '../utils/pricing';

interface PaymentPageProps {
  checkoutData: CheckoutData;
  onBack: () => void;
  onPaymentComplete: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ checkoutData, onBack, onPaymentComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'debit'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    cpf: '',
    email: '',
    phone: ''
  });

  const showPixOption = checkoutData.billingPeriod === 'annual' || checkoutData.billingPeriod === 'biannual';
  const isAnnualOrBiannual = checkoutData.billingPeriod === 'annual' || checkoutData.billingPeriod === 'biannual';

  const getMonthsMultiplier = () => {
    switch (checkoutData.billingPeriod) {
      case 'annual': return 12;
      case 'biannual': return 24;
      default: return 1;
    }
  };

  const monthsMultiplier = getMonthsMultiplier();
  const installmentValue = checkoutData.totalAmount / 12; // Até 12x sem juros
  const installmentValueBiannual = checkoutData.totalAmount / 24; // 24x com juros para bianual

  const handlePayment = async () => {
    if (paymentMethod === 'debit') {
      handleWhatsAppDebit();
      return;
    }

    setIsProcessing(true);
    
    // Simula processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    onPaymentComplete();
  };

  const handleWhatsAppDebit = () => {
    const phone = '5511999999999';
    const message = encodeURIComponent(
      `Olá! Gostaria de finalizar minha compra do Plano Dez Emergências com débito automático.\n\n` +
      `Dados do pedido:\n` +
      `• Titular: ${checkoutData.mainUser.name}\n` +
      `• Plano: ${checkoutData.billingPeriod === 'monthly' ? 'Mensal' : checkoutData.billingPeriod === 'annual' ? 'Anual' : 'Bianual'}\n` +
      `• Beneficiários: ${checkoutData.beneficiaries.length}\n` +
      `• Total: ${formatCurrency(checkoutData.totalAmount)}\n\n` +
      `Aguardo contato para finalizar com débito automático.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-900 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao resumo</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resumo do Pedido */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumo do Pedido</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Plano:</span>
                <span className="font-medium">Dez Emergências</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Titular:</span>
                <span className="font-medium">{checkoutData.mainUser.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Modalidade:</span>
                <span className="font-medium">
                  {checkoutData.billingPeriod === 'monthly' ? 'Mensal' :
                   checkoutData.billingPeriod === 'annual' ? 'Anual' : 'Bianual'}
                </span>
              </div>
              
              {checkoutData.beneficiaries.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Beneficiários:</span>
                  <span className="font-medium">{checkoutData.beneficiaries.length}</span>
                </div>
              )}

              {checkoutData.selectedOptionals.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Serviços Opcionais:</span>
                  <span className="font-medium">{checkoutData.selectedOptionals.length}</span>
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-blue-900">{formatCurrency(checkoutData.totalAmount)}</span>
                </div>
                
                {isAnnualOrBiannual && (
                  <div className="text-sm text-gray-600 mt-2">
                    Valor referente a {monthsMultiplier} meses
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pagamento */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <CreditCard className="h-6 w-6 text-blue-900 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Pagamento Seguro</h2>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <Lock className="h-4 w-4" />
                <span>Seus dados estão protegidos com criptografia SSL</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Processamento seguro via Stripe</span>
              </div>
            </div>

            {/* Seleção de Método de Pagamento */}
            <div className="space-y-4 mb-6">
              <h3 className="font-medium text-gray-900">Escolha a forma de pagamento:</h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'pix' | 'debit')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Cartão de Crédito</span>
                      {isAnnualOrBiannual && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Parcelamento disponível
                        </span>
                      )}
                    </div>
                    {isAnnualOrBiannual && (
                      <div className="text-xs text-gray-500 mt-1">
                        Até 12x sem juros de {formatCurrency(installmentValue)}
                        {checkoutData.billingPeriod === 'biannual' && (
                          <span> • Até 24x de {formatCurrency(installmentValueBiannual)}</span>
                        )}
                      </div>
                    )}
                  </div>
                </label>

                {showPixOption && (
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="pix"
                      checked={paymentMethod === 'pix'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'pix' | 'debit')}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-medium">PIX</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        À vista
                      </span>
                    </div>
                  </label>
                )}

              </div>
            </div>

            {/* Formulário de Cartão */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Nome no Cartão *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome como está no cartão"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CreditCard className="h-4 w-4 inline mr-2" />
                      Número do Cartão *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="**** **** **** ****"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Validade *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MM/AA"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="***"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="h-4 w-4 inline mr-2" />
                      CPF *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardData.cpf}
                      onChange={(e) => setCardData({ ...cardData, cpf: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={cardData.email}
                      onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={cardData.phone}
                      onChange={(e) => setCardData({ ...cardData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                {/* Opções de Parcelamento para Anuais */}
                {isAnnualOrBiannual && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-3">
                      💳 Opções de Parcelamento no Cartão
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-yellow-800">À vista:</span>
                        <span className="font-semibold text-yellow-900">{formatCurrency(checkoutData.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-800">12x sem juros:</span>
                        <span className="font-semibold text-yellow-900">{formatCurrency(installmentValue)}</span>
                      </div>
                      {checkoutData.billingPeriod === 'biannual' && (
                        <div className="flex justify-between">
                          <span className="text-yellow-800">24x com juros:</span>
                          <span className="font-semibold text-yellow-900">{formatCurrency(installmentValueBiannual)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'pix' && showPixOption && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Smartphone className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-2">Pagamento PIX</h4>
                    <p className="text-sm text-green-700">
                      Pagamento à vista disponível para planos anuais e bianuais. 
                      Após confirmar, você receberá o código PIX para pagamento.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processando pagamento...
                </>
              ) : (
                <>
                  {paymentMethod === 'pix' ? <Smartphone className="h-5 w-5 mr-2" /> : <CreditCard className="h-5 w-5 mr-2" />}
                  Finalizar Pagamento - {formatCurrency(checkoutData.totalAmount)}
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Ao finalizar o pagamento, você concorda com nossos termos de uso e política de privacidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;