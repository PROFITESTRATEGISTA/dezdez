import React from 'react';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  lazy?: boolean;
  sizes?: string;
  srcSet?: string;
}

/**
 * SEO-optimized image component with built-in lazy loading, responsive images,
 * and proper alt text handling
 */
const OptimizedImage: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  lazy = true,
  sizes = '100vw',
  srcSet
}) => {
  // Generate default srcSet if not provided
  const defaultSrcSet = !srcSet && src.includes('.jpg') ? 
    `${src.replace('.jpg', '-300w.jpg')} 300w, 
     ${src.replace('.jpg', '-600w.jpg')} 600w, 
     ${src.replace('.jpg', '-900w.jpg')} 900w` : 
    (src.includes('.png') ? 
      `${src.replace('.png', '-300w.png')} 300w, 
       ${src.replace('.png', '-600w.png')} 600w, 
       ${src.replace('.png', '-900w.png')} 900w` : 
      undefined);

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={lazy ? "lazy" : "eager"}
      sizes={sizes}
      srcSet={srcSet || defaultSrcSet}
      // Add structured data attributes for better SEO
      itemProp="image"
      // Ensure images don't block rendering
      decoding="async"
    />
  );
};

export default OptimizedImage;