import React from 'react';
import { User, Users, Calendar, Shield, Download, Share } from 'lucide-react';

interface ClientCardsProps {
  user: any;
}

const ClientCards: React.FC<ClientCardsProps> = ({ user }) => {
  const handleDownload = (cardType: string, personName: string) => {
    alert(`Baixando carteirinha ${cardType} de ${personName}`);
  };

  const handleShare = (cardType: string, personName: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Carteirinha Dez Saúde',
        text: `Carteirinha ${cardType} - ${personName}`,
        url: window.location.href
      });
    } else {
      alert(`Compartilhando carteirinha de ${personName}`);
    }
  };

  const Card = ({ person, type, isPrimary = false }: { person: any; type: string; isPrimary?: boolean }) => (
    <div className={`bg-gradient-to-br ${isPrimary ? 'from-red-600 to-red-700' : 'from-blue-600 to-blue-700'} rounded-xl p-6 text-white shadow-lg relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <img 
            src="https://i.postimg.cc/G3jZ48Kd/image-1.png" 
            alt="Dez Saúd" 
            className="h-6 sm:h-8 w-auto"
          />
          <div className="text-right">
            <div className="text-xs opacity-75">ID: {person.id || user.id}</div>
            <div className="text-xs opacity-75">{type}</div>
          </div>
        </div>

        {/* Person Info */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold mb-1">{person.name || person.full_name}</h3>
          <p className="text-sm opacity-90">
            {isPrimary ? 'Titular' : `${person.relationship} • ${person.age} anos`}
          </p>
          <p className="text-xs opacity-75 mt-1">
            CPF: {person.cpf || user.personalData.cpf}
          </p>
        </div>

        {/* Plan Info */}
        <div className="mb-3 sm:mb-4">
          <div className="text-sm opacity-90">
            <div>Plano: {user.plan}</div>
            <div>Validade: {user.contractExpiration}</div>
          </div>
        </div>

        {/* Emergency Number */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
          <div className="text-xs opacity-75 mb-1">EMERGÊNCIA 24H</div>
          <div className="font-bold text-sm sm:text-base">0800-123-4567</div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 text-xs">
          <button
            onClick={() => handleDownload(type, person.name || person.full_name)}
            className="flex-1 bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1"
          >
            <Download className="h-3 w-3" />
            <span>Baixar</span>
          </button>
          <button
            onClick={() => handleShare(type, person.name || person.full_name)}
            className="flex-1 bg-white/20 hover:bg-white/30 px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1"
          >
            <Share className="h-3 w-3" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 lg:hidden">Carteirinhas</h1>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Shield className="h-6 w-6 mr-2 text-red-600" />
          Carteirinhas Digitais
        </h2>
        <div className="text-sm text-gray-600 w-full sm:w-auto">
          {1 + user.beneficiaries.length} carteirinha{user.beneficiaries.length > 0 ? 's' : ''}
        </div>
      </div>

      {/* Titular Card */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-red-600" />
          Titular
        </h3>
        <Card person={user} type="TITULAR" isPrimary={true} />
      </div>

      {/* Beneficiaries Cards */}
      {user.beneficiaries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Dependentes ({user.beneficiaries.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.beneficiaries.map((beneficiary: any) => (
              <Card 
                key={beneficiary.id} 
                person={beneficiary} 
                type="DEPENDENTE" 
              />
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Instruções da Carteirinha
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Sempre tenha sua carteirinha em mãos em emergências</li>
          <li>• Apresente o documento em qualquer atendimento médico</li>
          <li>• Em caso de perda, acesse esta área para reimprimir</li>
          <li>• A carteirinha digital tem a mesma validade que a física</li>
        </ul>
      </div>
    </div>
  );
};

export default ClientCards;