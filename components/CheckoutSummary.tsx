import React, { useState } from 'react';
import { Mail, CreditCard, Calculator, Percent, Smartphone, FileText, Eye } from 'lucide-react';
import { CheckoutData, BillingPeriod } from '../types';
import { formatCurrency, calculateTotal, getPriceByAge, getDiscountPercentage, getAnnualSavings, getBiannualSavings } from '../utils/pricing';
import { optionals } from '../data/plans';

interface CheckoutSummaryProps {
  checkoutData: CheckoutData;
  billingPeriod: BillingPeriod;
  onSendEmail: () => void;
  onProceedToPayment: () => void;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  checkoutData,
  billingPeriod,
  onSendEmail,
  onProceedToPayment
}) => {
  const [emailSent, setEmailSent] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [showContract, setShowContract] = useState(false);

  const mainUserPrice = getPriceByAge(checkoutData.mainUser.age);
  const beneficiariesTotal = checkoutData.beneficiaries.reduce(
    (sum, b) => sum + getPriceByAge(b.age), 0
  );
  
  const selectedOptionalsPrices = checkoutData.selectedOptionals.map(id => {
    const optional = optionals.find(o => o.id === id);
    return optional ? optional.price : 0;
  });
  
  // Opcionais aplicados para TODAS as vidas
  const totalLives = 1 + checkoutData.beneficiaries.length;
  const optionalsPerLife = selectedOptionalsPrices.reduce((sum, price) => sum + price, 0);
  const optionalsTotal = optionalsPerLife * totalLives;
  
  const monthlySubtotal = mainUserPrice + beneficiariesTotal + optionalsTotal;
  const discountPercent = getDiscountPercentage(billingPeriod);
  
  // Cálculo do valor total baseado nos meses
  const getMonthsMultiplier = () => {
    switch (billingPeriod) {
      case 'annual': return 12;
      case 'biannual': return 24;
      default: return 1;
    }
  };

  const monthsMultiplier = getMonthsMultiplier();
  const totalBeforeDiscount = monthlySubtotal * monthsMultiplier;
  const discountAmount = totalBeforeDiscount * (discountPercent / 100);
  const totalAmount = totalBeforeDiscount - discountAmount;

  const showPixOption = billingPeriod === 'annual' || billingPeriod === 'biannual';

  const handleSendEmail = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setEmailSent(true);
    onSendEmail();
  };

  const handleViewContract = () => {
    setShowContract(true);
  };

  const getBillingLabel = () => {
    switch (billingPeriod) {
      case 'monthly': return 'Mensal';
      case 'annual': return 'Anual';
      case 'biannual': return 'Bianual';
    }
  };

  // Modal do Contrato
  if (showContract) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Contrato de Prestação de Serviços</h3>
            <button
              onClick={() => setShowContract(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="prose max-w-none text-sm">
              <h4 className="text-lg font-semibold mb-4">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE ASSISTÊNCIA MÉDICA DE URGÊNCIA E EMERGÊNCIA</h4>
              
              <p className="mb-4">
                <strong>CONTRATANTE:</strong> {checkoutData.mainUser.name}<br/>
                <strong>E-MAIL:</strong> {checkoutData.mainUser.email}<br/>
                <strong>TELEFONE:</strong> {checkoutData.mainUser.phone}
              </p>

              <p className="mb-4">
                <strong>CONTRATADA:</strong> Dez Emergências Médicas Ltda.<br/>
                <strong>CNPJ:</strong> 00.000.000/0001-00
              </p>

              <h5 className="font-semibold mt-6 mb-3">CLÁUSULA 1ª - DO OBJETO</h5>
              <p className="mb-4">
                O presente contrato tem por objeto a prestação de serviços de assistência médica de urgência e emergência 24 horas, 
                incluindo atendimento domiciliar, orientação médica telefônica, remoção em ambulância UTI e cobertura para mais de 
                40 tipos de emergências médicas.
              </p>

              <h5 className="font-semibold mt-6 mb-3">CLÁUSULA 2ª - DOS SERVIÇOS INCLUSOS</h5>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Atendimento médico domiciliar 24 horas por dia, 7 dias por semana</li>
                <li>Central de orientação médica telefônica</li>
                <li>Remoção em ambulância equipada com UTI móvel</li>
                <li>Cobertura nacional em todo território brasileiro</li>
                <li>Atendimento para mais de 40 tipos de emergências médicas</li>
                <li>Equipe médica especializada e qualificada</li>
              </ul>

              <h5 className="font-semibold mt-6 mb-3">CLÁUSULA 3ª - DOS BENEFICIÁRIOS</h5>
              <p className="mb-2"><strong>Titular:</strong> {checkoutData.mainUser.name}</p>
              {checkoutData.beneficiaries.length > 0 && (
                <>
                  <p className="mb-2"><strong>Beneficiários:</strong></p>
                  <ul className="list-disc pl-6 mb-4">
                    {checkoutData.beneficiaries.map((beneficiary, index) => (
                      <li key={index}>{beneficiary.name} - {beneficiary.relationship} - {beneficiary.age} anos</li>
                    ))}
                  </ul>
                </>
              )}

              <h5 className="font-semibold mt-6 mb-3">CLÁUSULA 4ª - DO VALOR E FORMA DE PAGAMENTO</h5>
              <p className="mb-4">
                <strong>Modalidade:</strong> {getBillingLabel()}<br/>
                <strong>Valor Total:</strong> {formatCurrency(totalAmount)}<br/>
                <strong>Forma de Pagamento:</strong> Conforme selecionado no checkout
              </p>

              <h5 className="font-semibold mt-6 mb-3">CLÁUSULA 5ª - DA VIGÊNCIA</h5>
              <p className="mb-4">
                Este contrato terá vigência de {billingPeriod === 'monthly' ? '1 (um) mês' : 
                billingPeriod === 'annual' ? '12 (doze) meses' : '24 (vinte e quatro) meses'}, 
                renovável automaticamente por períodos iguais, salvo manifestação em contrário de qualquer das partes.
              </p>

              <h5 className="font-semibold mt-6 mb-3">CLÁUSULA 6ª - DAS OBRIGAÇÕES</h5>
              <p className="mb-4">
                <strong>Da Contratada:</strong> Prestar os serviços descritos neste contrato com qualidade e pontualidade, 
                mantendo equipe médica qualificada disponível 24 horas por dia.
              </p>
              <p className="mb-4">
                <strong>Do Contratante:</strong> Efetuar o pagamento nas datas acordadas e fornecer informações 
                verídicas sobre seu estado de saúde e dos beneficiários.
              </p>

              <h5 className="font-semibold mt-6 mb-3">CLÁUSULA 7ª - DO FORO</h5>
              <p className="mb-4">
                Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer questões oriundas deste contrato.
              </p>

              <p className="mt-8 text-center text-gray-600">
                <em>Este contrato será enviado por e-mail após a aprovação dos documentos para assinatura digital.</em>
              </p>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setShowContract(false)}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fechar Contrato
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-blue-900 mr-3" />
        <h3 className="text-xl font-semibold text-gray-900">Resumo do Pedido</h3>
      </div>

      <div className="space-y-4 mb-6">
        {/* Titular */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">{checkoutData.mainUser.name}</p>
            <p className="text-sm text-gray-600">Titular • {checkoutData.mainUser.age} anos</p>
          </div>
          <span className="font-semibold text-blue-900">
            {formatCurrency(mainUserPrice)}
          </span>
        </div>

        {/* Beneficiários */}
        {checkoutData.beneficiaries.map((beneficiary) => (
          <div key={beneficiary.id} className="flex justify-between items-center pb-2 border-b border-gray-200">
            <div>
              <p className="font-medium text-gray-900">{beneficiary.name}</p>
              <p className="text-sm text-gray-600">{beneficiary.relationship} • {beneficiary.age} anos</p>
            </div>
            <span className="font-semibold text-blue-900">
              {formatCurrency(getPriceByAge(beneficiary.age))}
            </span>
          </div>
        ))}

        {/* Serviços Opcionais - Aplicados para todas as vidas */}
        {checkoutData.selectedOptionals.map((optionalId) => {
          const optional = optionals.find(o => o.id === optionalId);
          if (!optional) return null;

          // Verificar se é um item incluído
          const isIncluded = optional.included === true;
          
          return (
            <div key={optionalId} className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{optional.name}</p>
                  <p className="text-sm text-green-700">
                    Aplicado para {totalLives} vida{totalLives > 1 ? 's' : ''} 
                    {totalLives > 1 && ` (titular + ${totalLives - 1} beneficiário${totalLives - 1 > 1 ? 's' : ''})`}
                  </p>
                </div>
                <div className="text-right">
                  {optional.free || isIncluded ? (
                    <span className="text-green-600 font-semibold">GRÁTIS</span>
                  ) : (
                    <>
                      <div className="font-semibold text-green-600">
                        {formatCurrency(optional.price * totalLives)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(optional.price)} × {totalLives}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cálculo Detalhado */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Subtotal mensal:</span>
          <span className="font-medium">{formatCurrency(monthlySubtotal)}</span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Modalidade:</span>
          <span className="font-medium">{getBillingLabel()}</span>
        </div>

        {billingPeriod !== 'monthly' && (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Valor por {monthsMultiplier} meses:</span>
              <span className="font-medium">{formatCurrency(totalBeforeDiscount)}</span>
            </div>
            
            {discountPercent > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">
                  Desconto {getBillingLabel()} ({discountPercent}%):
                </span>
                <span className="text-green-600 font-medium flex items-center">
                  -{formatCurrency(billingPeriod === 'annual' ? getAnnualSavings() : getBiannualSavings())}
                </span>
              </div>
            )}
          </>
        )}

        {/* Opções de Pagamento - Apenas informativo */}
        <div className="border-t border-blue-200 pt-3 mt-3">
          <h4 className="font-medium text-gray-900 mb-3">Forma de Pagamento:</h4>
          
          <div className="space-y-2 mb-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'pix')}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Cartão de Crédito</span>
                {billingPeriod !== 'monthly' && (
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    Parcelamento em até 12x
                  </div>
                )}
              </div>
            </label>

            {showPixOption && (
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="pix"
                  checked={paymentMethod === 'pix'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'pix')}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">PIX</span>
                  </div>
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    Pagamento à vista
                  </div>
                </div>
              </label>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-blue-200 mt-3">
          <span className="text-lg font-semibold text-gray-900">Total:</span>
          <span className="text-2xl font-bold text-blue-900">
            {formatCurrency(totalAmount)}
          </span>
        </div>

        {paymentMethod === 'card' && billingPeriod !== 'monthly' && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm">
              <div className="font-medium text-yellow-800 mb-1">
                💳 Parcelamento no Cartão de Crédito
              </div>
              <div className="text-yellow-700 space-y-1">
                <div>• Até 12x sem juros: <strong>{formatCurrency(totalAmount / 12)}</strong></div>
                {billingPeriod === 'biannual' && (
                  <div>• Até 24x com juros: <strong>{formatCurrency(totalAmount / 24)}</strong></div>
                )}
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'pix' && showPixOption && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
            💰 PIX disponível para pagamento à vista
          </div>
        )}
      </div>

      {/* Acesso ao Contrato */}
      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 text-sm">Contrato de Prestação de Serviços</h4>
            <p className="text-xs text-gray-600 mt-1">
              Visualize os termos do contrato antes de finalizar
            </p>
          </div>
          <button
            onClick={handleViewContract}
            className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors text-sm"
          >
            <Eye className="h-4 w-4" />
            <span>Ver Contrato</span>
          </button>
        </div>
      </div>
 
      {/* Ações */}
      <div className="space-y-3">
        <button
          onClick={handleSendEmail}
          disabled={emailSent}
          className="w-full flex items-center justify-center space-x-2 py-3 px-6 border border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50 disabled:bg-gray-100 disabled:text-gray-500 transition-colors"
        >
          <Mail className="h-5 w-5" />
          <span>{emailSent ? 'Simulação enviada!' : 'Enviar simulação por email'}</span>
        </button>

        <button
          onClick={onProceedToPayment}
          className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <CreditCard className="h-5 w-5" />
          <span>Prosseguir para Pagamento</span>
        </button>
      </div>
    </div>
  );
};

export default CheckoutSummary;