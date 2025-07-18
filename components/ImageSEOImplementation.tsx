import React from 'react';
import OptimizedImage from './ImageOptimization';
import ResponsiveImage from './ResponsiveImage';
import LazyImage from './LazyImage';
import ProgressiveImage from './ProgressiveImage';
import ImageGallery from './ImageGallery';
import ImageUploader from './ImageUploader';
import ImageMap from './ImageMap';
import ImageSitemap from './ImageSitemap';

/**
 * Complete implementation of image SEO best practices
 */
const ImageSEOImplementation: React.FC = () => {
  // Example gallery images
  const galleryImages = [
    {
      src: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Equipe médica de emergência atendendo paciente em São Paulo",
      width: 800,
      height: 533,
      title: "Atendimento de Emergência"
    },
    {
      src: "https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Ambulância UTI móvel para transporte de emergência em São Paulo",
      width: 800,
      height: 533,
      title: "Ambulância UTI Móvel"
    },
    {
      src: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Família protegida por plano de emergência médica em São Paulo",
      width: 800,
      height: 533,
      title: "Proteção Familiar"
    }
  ];
  
  // Example image map areas
  const mapAreas = [
    {
      shape: 'rect' as const,
      coords: '0,0,200,200',
      href: '/cobertura/sao-paulo',
      alt: 'São Paulo Capital'
    },
    {
      shape: 'rect' as const,
      coords: '210,0,400,200',
      href: '/cobertura/guarulhos',
      alt: 'Guarulhos'
    },
    {
      shape: 'rect' as const,
      coords: '0,210,200,400',
      href: '/cobertura/abc',
      alt: 'Região do ABC'
    }
  ];
  
  // Example sitemap images
  const sitemapImages = [
    {
      url: '/images/hero-emergency-medical.jpg',
      loc: '/',
      title: 'Serviço de Emergência Médica 24h em São Paulo',
      caption: 'Equipe médica especializada em atendimento de emergência',
      geoLocation: 'São Paulo, Brasil'
    },
    {
      url: '/images/ambulance-service.jpg',
      loc: '/',
      title: 'Ambulância UTI Móvel',
      caption: 'Serviço de ambulância com UTI móvel para emergências',
      geoLocation: 'São Paulo, Brasil'
    },
    {
      url: '/images/medical-team.jpg',
      loc: '/beneficios',
      title: 'Equipe Médica Especializada',
      caption: 'Nossa equipe de médicos e enfermeiros especializados'
    }
  ];

  const handleImageUpload = (file: File) => {
    console.log('Optimized image:', file);
    // In a real app, you would upload this file to your server or CDN
  };

  return (
    <div className="space-y-16 py-8">
      {/* Image Sitemap */}
      <ImageSitemap 
        domain="https://yourdomain.com" 
        images={sitemapImages} 
      />
      
      <section>
        <h2 className="text-2xl font-bold mb-6">1. Hero Image (Above the Fold)</h2>
        <p className="text-gray-600 mb-4">
          Imagens acima da dobra devem carregar com prioridade e não usar lazy loading
        </p>
        
        <ResponsiveImage
          src="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Equipe médica de emergência atendendo paciente em São Paulo"
          width={1200}
          height={800}
          usage="hero"
          priority={true}
        />
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">2. Imagens de Conteúdo (Abaixo da Dobra)</h2>
        <p className="text-gray-600 mb-4">
          Imagens abaixo da dobra devem usar lazy loading para melhorar performance
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OptimizedImage
            src="https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Ambulância UTI móvel para transporte de emergência em São Paulo"
            width={600}
            height={400}
            className="rounded-lg shadow-md"
            lazy={true}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          
          <LazyImage
            src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Família protegida por plano de emergência médica em São Paulo"
            width={600}
            height={400}
            className="rounded-lg shadow-md"
          />
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">3. Galeria de Imagens com Structured Data</h2>
        <p className="text-gray-600 mb-4">
          Galerias devem usar structured data para melhor indexação
        </p>
        
        <ImageGallery 
          images={galleryImages}
          className="mb-8"
        />
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">4. Imagem com Carregamento Progressivo</h2>
        <p className="text-gray-600 mb-4">
          Carregamento progressivo melhora a experiência do usuário
        </p>
        
        <ProgressiveImage
          lowQualitySrc="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=50"
          highQualitySrc="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Médicos realizando atendimento de emergência em São Paulo"
          width={800}
          height={533}
          className="rounded-lg shadow-md"
        />
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">5. Mapa de Imagem Otimizado para SEO</h2>
        <p className="text-gray-600 mb-4">
          Mapas de imagem devem incluir links acessíveis para SEO
        </p>
        
        <ImageMap
          src="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Mapa de cobertura de serviços de emergência em São Paulo"
          width={800}
          height={533}
          className="rounded-lg shadow-md"
          areas={mapAreas}
        />
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">6. Upload de Imagens com Otimização Automática</h2>
        <p className="text-gray-600 mb-4">
          Otimize imagens no momento do upload para garantir boas práticas
        </p>
        
        <ImageUploader
          onImageUpload={handleImageUpload}
          maxSize={5}
          allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
          className="mb-8"
        />
      </section>
    </div>
  );
};

export default ImageSEOImplementation;