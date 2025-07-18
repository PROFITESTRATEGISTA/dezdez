import React from 'react';
import { MapPin, Phone, Shield, CheckCircle } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import LocalSEO from './LocalSEO';

interface LocationPageProps {
  city: string;
  region: string;
  businessName: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  phoneNumber: string;
  latitude?: number;
  longitude?: number;
}

const LocationPage: React.FC<LocationPageProps> = ({
  city,
  region,
  businessName,
  streetAddress,
  addressLocality,
  addressRegion,
  postalCode,
  phoneNumber,
  latitude,
  longitude
}) => {
  const breadcrumbItems = [
    { label: 'Cobertura', path: '/cobertura' },
    { label: `${city}`, path: `/cobertura/${city.toLowerCase().replace(/\s+/g, '-')}`, isLast: true }
  ];

  const benefits = [
    'Atendimento domiciliar 24h',
    'Orientação médica por telefone',
    'Remoção em ambulância UTI',
    'Equipe médica especializada',
    'Cobertura para mais de 40 emergências',
    'Tempo de resposta otimizado'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <LocalSEO 
        businessName={`${businessName} - ${city}`}
        streetAddress={streetAddress}
        addressLocality={addressLocality}
        addressRegion={addressRegion}
        postalCode={postalCode}
        phoneNumber={phoneNumber}
        latitude={latitude}
        longitude={longitude}
        description={`Plano de emergências médicas com atendimento 24h em ${city}, ${region}. Ambulância UTI, médico em casa e orientação por telefone.`}
      />
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Emergência Médica 24h em {city}
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Atendimento médico de urgência e emergência 24 horas por dia em {city}, {region}.
                Sua família protegida com o melhor serviço de emergências médicas da região.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <MapPin className="h-6 w-6 text-blue-200" />
                  <h3 className="font-semibold text-lg">Cobertura em {city}</h3>
                </div>
                <p className="text-blue-100 text-sm">
                  Atendimento exclusivo em {city} e bairros próximos com tempo de resposta otimizado.
                </p>
              </div>
              
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <Phone className="h-6 w-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Emergência 24h</h3>
                  <a href={`tel:${phoneNumber.replace(/\D/g, '')}`} className="text-blue-200 hover:text-white">
                    {phoneNumber}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt={`Equipe médica de emergência em ${city}`}
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-blue-900 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 text-white p-2 rounded-full">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Proteção 24h em {city}</p>
                    <p className="text-sm text-gray-600">Atendimento garantido</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Benefícios do nosso atendimento em {city}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos o melhor serviço de emergências médicas em {city} com atendimento rápido e eficiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700">{benefit} em {city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nossa área de cobertura em {city}
            </h2>
            <p className="text-xl text-gray-600">
              Atendemos em toda a região de {city} com tempo de resposta otimizado
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg">
              {/* In production, replace this with an actual Google Map */}
              <div className="w-full h-96 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900">Mapa de {city}</h3>
                  <p className="text-blue-700">Cobertura em toda a região</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Contrate agora seu plano de emergências médicas em {city}
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Proteção completa para você e sua família com o melhor atendimento de {city}
          </p>
          
          <button className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
            Contratar Plano para {city}
          </button>
        </div>
      </section>
    </div>
  );
};

export default LocationPage;