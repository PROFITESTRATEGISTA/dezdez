import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderColor?: string;
  threshold?: number;
}

/**
 * Advanced lazy loading image component with IntersectionObserver
 * and blur-up effect
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderColor = '#f3f4f6',
  threshold = 0.1
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Skip if image is already loaded or browser doesn't support IntersectionObserver
    if (isLoaded || typeof IntersectionObserver !== 'function') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isLoaded, threshold]);

  // Calculate aspect ratio for placeholder
  const aspectRatio = width && height ? `${(height / width) * 100}%` : '56.25%'; // Default to 16:9

  return (
    <div 
      className="relative overflow-hidden"
      style={{ 
        paddingBottom: aspectRatio,
        backgroundColor: placeholderColor,
        width: '100%'
      }}
    >
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

export default LazyImage;