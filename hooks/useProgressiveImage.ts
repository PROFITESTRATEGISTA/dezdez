import { useState, useEffect } from 'react';

/**
 * Hook for progressive image loading with low-quality placeholder
 * @param lowQualitySrc Low quality placeholder image
 * @param highQualitySrc High quality final image
 * @returns Current src and loading state
 */
const useProgressiveImage = (lowQualitySrc: string, highQualitySrc: string) => {
  const [src, setSrc] = useState(lowQualitySrc);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset if sources change
    setSrc(lowQualitySrc);
    setIsLoading(true);
    
    // Preload high quality image
    const img = new Image();
    img.src = highQualitySrc;
    
    img.onload = () => {
      setSrc(highQualitySrc);
      setIsLoading(false);
    };
    
    // Clean up
    return () => {
      img.onload = null;
    };
  }, [lowQualitySrc, highQualitySrc]);

  return { src, isLoading };
};

export default useProgressiveImage;