import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import NAP from './NAP';

interface LocalBusinessFooterProps {
  businessName: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  phoneNumber: string;
  email?: string;
  openingHours?: string[];
}

const LocalBusinessFooter: React.FC<LocalBusinessFooterProps> = ({
  businessName,
  streetAddress,
  addressLocality,
  addressRegion,
  postalCode,
  phoneNumber,
  email,
  openingHours = ['Segunda a Domingo: 24 horas']
}) => {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Sobre Nós</h3>
            <p className="text-blue-100 mb-4">
              Oferecemos planos de assistência médica de urgência e emergência 24h, 
              com cobertura em São Paulo e Grande SP.
            </p>
            <div className="flex items-center space-x-2 text-blue-200">
              <MapPin className="h-5 w-5" />
              <span>Atendimento em São Paulo e Grande SP</span>
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <NAP 
              businessName={businessName}
              streetAddress={streetAddress}
              addressLocality={addressLocality}
              addressRegion={addressRegion}
              postalCode={postalCode}
              phoneNumber={phoneNumber}
              email={email}
              className="text-blue-100"
            />
          </div>
          
          {/* Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">Horário de Atendimento</h3>
            <div className="flex items-start space-x-2 mb-4">
              <Clock className="h-5 w-5 text-blue-200 mt-0.5" />
              <div>
                {openingHours.map((hours, index) => (
                  <p key={index} className="text-blue-100">{hours}</p>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2 text-blue-200">Emergência 24h</h4>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-200" />
                <a href={`tel:${phoneNumber.replace(/\D/g, '')}`} className="text-blue-100 hover:text-white">
                  {phoneNumber}
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200 text-sm">
          <p>&copy; {new Date().getFullYear()} {businessName}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default LocalBusinessFooter;