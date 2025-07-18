import React from 'react';
import { generateSizes } from '../utils/imageUtils';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  usage?: 'hero' | 'thumbnail' | 'gallery' | 'content';
  priority?: boolean;
}

/**
 * Responsive image component with WebP support and art direction
 */
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  usage = 'content',
  priority = false
}) => {
  // Extract base filename and extension
  const baseSrc = src.substring(0, src.lastIndexOf('.'));
  const extension = src.substring(src.lastIndexOf('.') + 1);
  
  // Generate sizes attribute based on usage
  const sizes = generateSizes(usage);
  
  // Generate srcsets for different formats
  const jpgSrcSet = `
    ${baseSrc}-300w.jpg 300w,
    ${baseSrc}-600w.jpg 600w,
    ${baseSrc}-900w.jpg 900w,
    ${baseSrc}-1200w.jpg 1200w
  `;
  
  const webpSrcSet = `
    ${baseSrc}-300w.webp 300w,
    ${baseSrc}-600w.webp 600w,
    ${baseSrc}-900w.webp 900w,
    ${baseSrc}-1200w.webp 1200w
  `;

  return (
    <picture>
      {/* WebP format for browsers that support it */}
      <source
        type="image/webp"
        srcSet={webpSrcSet}
        sizes={sizes}
      />
      
      {/* Fallback to jpg/png */}
      <source
        type={`image/${extension}`}
        srcSet={jpgSrcSet}
        sizes={sizes}
      />
      
      {/* Fallback image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // Add structured data attributes
        itemProp="image"
      />
    </picture>
  );
};

export default ResponsiveImage;