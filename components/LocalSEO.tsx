import React from 'react';
import { Helmet } from 'react-helmet';

interface LocalSEOProps {
  businessName: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  phoneNumber: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  openingHours?: string[];
  priceRange?: string;
  images?: string[];
}

const LocalSEO: React.FC<LocalSEOProps> = ({
  businessName,
  streetAddress,
  addressLocality,
  addressRegion,
  postalCode,
  phoneNumber,
  latitude,
  longitude,
  description = 'Plano de assistência médica de urgência e emergência 24h em São Paulo e Grande SP.',
  openingHours = ['Mo-Su 00:00-23:59'],
  priceRange = '$$',
  images = []
}) => {
  // Format structured data for LocalBusiness
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: businessName,
    description: description,
    telephone: phoneNumber,
    priceRange: priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: streetAddress,
      addressLocality: addressLocality,
      addressRegion: addressRegion,
      postalCode: postalCode,
      addressCountry: 'BR'
    },
    geo: latitude && longitude ? {
      '@type': 'GeoCoordinates',
      latitude: latitude,
      longitude: longitude
    } : undefined,
    openingHoursSpecification: openingHours.map(hours => {
      const [days, timeRange] = hours.split(' ');
      const [opens, closes] = timeRange.split('-');
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days.split('-').map(day => {
          const dayMap: Record<string, string> = {
            'Mo': 'Monday',
            'Tu': 'Tuesday',
            'We': 'Wednesday',
            'Th': 'Thursday',
            'Fr': 'Friday',
            'Sa': 'Saturday',
            'Su': 'Sunday'
          };
          return dayMap[day as keyof typeof dayMap] || day;
        }),
        opens: opens,
        closes: closes
      };
    }),
    image: images.length > 0 ? images : undefined
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default LocalSEO;