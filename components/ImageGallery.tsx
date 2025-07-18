import React from 'react';
import OptimizedImage from './ImageOptimization';
import { generateSeoFilename } from '../utils/imageUtils';

interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
}

/**
 * SEO-optimized image gallery with structured data
 */
const ImageGallery: React.FC<ImageGalleryProps> = ({ images, className = '' }) => {
  // Generate JSON-LD structured data for the image gallery
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Medical Emergency Services Gallery',
    description: 'Images of our medical emergency services and facilities',
    image: images.map(img => ({
      '@type': 'ImageObject',
      contentUrl: img.src,
      name: img.title || img.alt,
      description: img.alt,
      width: img.width,
      height: img.height
    }))
  };

  return (
    <div className={`image-gallery ${className}`} itemScope itemType="https://schema.org/ImageGallery">
      {/* Add structured data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Gallery title for SEO */}
      <meta itemProp="name" content="Medical Emergency Services Gallery" />
      <meta itemProp="description" content="Images of our medical emergency services and facilities" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="gallery-item" 
            itemProp="image" 
            itemScope 
            itemType="https://schema.org/ImageObject"
          >
            <OptimizedImage
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="w-full h-auto rounded-lg"
              lazy={true}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {image.title && (
              <p className="text-sm text-gray-700 mt-2" itemProp="name">{image.title}</p>
            )}
            <meta itemProp="contentUrl" content={image.src} />
            <meta itemProp="width" content={image.width.toString()} />
            <meta itemProp="height" content={image.height.toString()} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;