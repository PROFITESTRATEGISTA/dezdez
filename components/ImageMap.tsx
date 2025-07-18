import React from 'react';

interface ImageMapProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  areas: Array<{
    shape: 'rect' | 'circle' | 'poly';
    coords: string;
    href: string;
    alt: string;
  }>;
}

/**
 * SEO-optimized image map component
 */
const ImageMap: React.FC<ImageMapProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  areas
}) => {
  const mapName = `map-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={className}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        useMap={`#${mapName}`}
        className="max-w-full h-auto"
        loading="lazy"
        decoding="async"
      />
      
      <map name={mapName}>
        {areas.map((area, index) => (
          <area
            key={index}
            shape={area.shape}
            coords={area.coords}
            href={area.href}
            alt={area.alt}
            title={area.alt} // For better accessibility
          />
        ))}
      </map>
      
      {/* Hidden list of links for SEO and accessibility */}
      <div className="sr-only">
        <p>Áreas no mapa de imagem:</p>
        <ul>
          {areas.map((area, index) => (
            <li key={index}>
              <a href={area.href}>{area.alt}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ImageMap;