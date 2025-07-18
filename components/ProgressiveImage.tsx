import React from 'react';
import useProgressiveImage from '../hooks/useProgressiveImage';

interface ProgressiveImageProps {
  lowQualitySrc: string;
  highQualitySrc: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Component for progressive image loading with blur-up effect
 */
const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  lowQualitySrc,
  highQualitySrc,
  alt,
  width,
  height,
  className = ''
}) => {
  const { src, isLoading } = useProgressiveImage(lowQualitySrc, highQualitySrc);

  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-500 ${className} ${isLoading ? 'filter blur-sm' : 'filter blur-0'}`}
        style={{ 
          objectFit: 'cover',
          width: '100%',
          height: '100%'
        }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default ProgressiveImage;