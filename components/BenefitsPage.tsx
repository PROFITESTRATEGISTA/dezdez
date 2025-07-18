import React, { useState } from 'react';
import { ArrowLeft, Search, MapPin, Phone, Globe, Percent, Heart, Pill, TestTube, Scissors, Car, Home, ShoppingBag, Utensils, Plane, GraduationCap, Dumbbell, Baby, Shield } from 'lucide-react';

interface BenefitsPageProps {
  onBack: () => void;
}

const BenefitsPage: React.FC<BenefitsPageProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: Shield },
    { id: 'health', name: 'Saúde', icon: Heart },
    { id: 'pharmacy', name: 'Farmácias', icon: Pill },
    { id: 'labs', name: 'Laboratórios', icon: TestTube },
    { id: 'beauty', name: 'Beleza', icon: Scissors },
    { id: 'automotive', name: 'Automotivo', icon: Car },
    { id: 'home', name: 'Casa & Lar', icon: Home },
    { id: 'shopping', name: 'Compras', icon: ShoppingBag },
    { id: 'food', name: 'Alimentação', icon: Utensils },
    { id: 'travel', name: 'Viagens', icon: Plane },
    { id: 'education', name: 'Educação', icon: GraduationCap },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell },
    { id: 'kids', name: 'Infantil', icon: Baby }
  ];

  const partners = [
    // Saúde
    {
      id: 1,
      name: 'Fleury',
      category: 'health',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 40%',
      description: 'Exames laboratoriais e diagnósticos por imagem',
      locations: '500+ unidades',
      phone: '(11) 3179-0822',
      website: 'fleury.com.br'
    },
    {
      id: 2,
      name: 'Dasa',
      category: 'health',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 35%',
      description: 'Rede de laboratórios e medicina diagnóstica',
      locations: '800+ unidades',
      phone: '(11) 4004-4400',
      website: 'dasa.com.br'
    },
    
    // Farmácias
    {
      id: 3,
      name: 'Pague Menos',
      category: 'pharmacy',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 80%',
      description: 'Medicamentos, cosméticos e produtos de saúde',
      locations: '1000+ lojas',
      phone: '0800 770 8000',
      website: 'paguemenos.com.br'
    },
    {
      id: 4,
      name: 'Droga Raia',
      category: 'pharmacy',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 75%',
      description: 'Farmácia completa com delivery',
      locations: '1500+ lojas',
      phone: '4003-3040',
      website: 'drogaraia.com.br'
    },
    {
      id: 5,
      name: 'Drogasil',
      category: 'pharmacy',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 70%',
      description: 'Medicamentos e produtos de beleza',
      locations: '1200+ lojas',
      phone: '4003-4040',
      website: 'drogasil.com.br'
    },

    // Beleza
    {
      id: 6,
      name: 'Femme',
      category: 'beauty',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 50%',
      description: 'Salões de beleza e estética',
      locations: '300+ salões',
      phone: '(11) 3456-7890',
      website: 'femme.com.br'
    },
    {
      id: 7,
      name: 'Marco Aldany',
      category: 'beauty',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 45%',
      description: 'Cabeleireiros e tratamentos capilares',
      locations: '200+ salões',
      phone: '(11) 2345-6789',
      website: 'marcoaldany.com.br'
    },

    // Laboratórios
    {
      id: 8,
      name: 'Hermes Pardini',
      category: 'labs',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 40%',
      description: 'Análises clínicas e medicina diagnóstica',
      locations: '400+ unidades',
      phone: '(31) 3228-6200',
      website: 'hermespardini.com.br'
    },
    {
      id: 9,
      name: 'Lavoisier',
      category: 'labs',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 35%',
      description: 'Exames laboratoriais especializados',
      locations: '150+ unidades',
      phone: '(11) 3047-4000',
      website: 'lavoisier.com.br'
    },

    // Automotivo
    {
      id: 10,
      name: 'Mobil 1',
      category: 'automotive',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 25%',
      description: 'Troca de óleo e manutenção automotiva',
      locations: '800+ postos',
      phone: '0800 770 7070',
      website: 'mobil1.com.br'
    },
    {
      id: 11,
      name: 'Bosch Car Service',
      category: 'automotive',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 30%',
      description: 'Oficinas especializadas e peças automotivas',
      locations: '600+ oficinas',
      phone: '0800 704 4040',
      website: 'boschcarservice.com.br'
    },

    // Casa & Lar
    {
      id: 12,
      name: 'Leroy Merlin',
      category: 'home',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 15%',
      description: 'Materiais de construção e decoração',
      locations: '50+ lojas',
      phone: '4004-7300',
      website: 'leroymerlin.com.br'
    },
    {
      id: 13,
      name: 'Tok&Stok',
      category: 'home',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 20%',
      description: 'Móveis e decoração para casa',
      locations: '80+ lojas',
      phone: '4003-4555',
      website: 'tokstok.com.br'
    },

    // Compras
    {
      id: 14,
      name: 'Magazine Luiza',
      category: 'shopping',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 12%',
      description: 'Eletrodomésticos e eletrônicos',
      locations: '1000+ lojas',
      phone: '4003-0555',
      website: 'magazineluiza.com.br'
    },
    {
      id: 15,
      name: 'Americanas',
      category: 'shopping',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 10%',
      description: 'Variedades e produtos diversos',
      locations: '1500+ lojas',
      phone: '4003-4848',
      website: 'americanas.com.br'
    },

    // Alimentação
    {
      id: 16,
      name: 'iFood',
      category: 'food',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 25%',
      description: 'Delivery de restaurantes',
      locations: 'App disponível',
      phone: '(11) 4003-1111',
      website: 'ifood.com.br'
    },
    {
      id: 17,
      name: 'Outback',
      category: 'food',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 20%',
      description: 'Restaurante australiano',
      locations: '100+ restaurantes',
      phone: '(11) 4003-2222',
      website: 'outback.com.br'
    },

    // Viagens
    {
      id: 18,
      name: 'CVC',
      category: 'travel',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 15%',
      description: 'Pacotes de viagem e turismo',
      locations: '800+ agências',
      phone: '4003-1500',
      website: 'cvc.com.br'
    },
    {
      id: 19,
      name: 'Decolar',
      category: 'travel',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 12%',
      description: 'Passagens aéreas e hotéis',
      locations: 'Online',
      phone: '4003-7890',
      website: 'decolar.com'
    },

    // Educação
    {
      id: 20,
      name: 'Wizard',
      category: 'education',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 30%',
      description: 'Cursos de idiomas',
      locations: '1200+ escolas',
      phone: '4003-4004',
      website: 'wizard.com.br'
    },
    {
      id: 21,
      name: 'Kumon',
      category: 'education',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 25%',
      description: 'Método de ensino japonês',
      locations: '1500+ unidades',
      phone: '(11) 3065-4000',
      website: 'kumon.com.br'
    },

    // Fitness
    {
      id: 22,
      name: 'Smart Fit',
      category: 'fitness',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 20%',
      description: 'Academia de musculação',
      locations: '1000+ unidades',
      phone: '4020-1010',
      website: 'smartfit.com.br'
    },
    {
      id: 23,
      name: 'Bio Ritmo',
      category: 'fitness',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 25%',
      description: 'Academia completa com piscina',
      locations: '50+ unidades',
      phone: '(11) 3030-3030',
      website: 'bioritmo.com.br'
    },

    // Infantil
    {
      id: 24,
      name: 'Ri Happy',
      category: 'kids',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 15%',
      description: 'Brinquedos e produtos infantis',
      locations: '300+ lojas',
      phone: '4003-7474',
      website: 'rihappy.com.br'
    },
    {
      id: 25,
      name: 'PBKids',
      category: 'kids',
      logo: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=200',
      discount: 'Até 20%',
      description: 'Roupas e acessórios infantis',
      locations: '200+ lojas',
      phone: '(11) 4040-4040',
      website: 'pbkids.com.br'
    }
  ];

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || partner.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPartners = partners.length;
  const totalBenefits = 200; // Mais de 200 benefícios

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-blue-900 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <img 
                src="/image (1).png" 
                alt="Dez Emergências Médicas" 
                className="h-8 w-auto"
              />
              <span className="text-lg font-semibold text-blue-900">Rede de Benefícios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Mais de {totalBenefits} Benefícios Exclusivos
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Descontos especiais em farmácias, laboratórios, clínicas, restaurantes, 
            academias e muito mais. Sua família economiza todos os dias!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">{totalPartners}+</div>
              <div className="text-blue-200">Parceiros Credenciados</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">80%</div>
              <div className="text-blue-200">Desconto Máximo</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl font-bold mb-2">24h</div>
              <div className="text-blue-200">Disponível Sempre</div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Search and Filters */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar parceiros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <div key={partner.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900">{partner.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Percent className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-semibold">{partner.discount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{partner.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{partner.locations}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{partner.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>{partner.website}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3">
                  <button className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium">
                    Ver Detalhes do Desconto
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPartners.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum parceiro encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar sua busca ou filtros para encontrar mais parceiros.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Aproveite Todos Esses Benefícios
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Contrate seu plano Dez Emergências e tenha acesso imediato a mais de {totalBenefits} benefícios exclusivos
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold mb-1">Fleury</div>
                <div className="text-blue-200 text-sm">Até 40% OFF</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">Pague Menos</div>
                <div className="text-blue-200 text-sm">Até 80% OFF</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">Femme</div>
                <div className="text-blue-200 text-sm">Até 50% OFF</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={onBack}
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Contratar Plano Agora
          </button>
        </div>
      </section>
    </div>
  );
};

export default BenefitsPage;