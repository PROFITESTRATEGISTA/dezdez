import React from 'react';
import OptimizedImage from './ImageOptimization';
import ResponsiveImage from './ResponsiveImage';
import LazyImage from './LazyImage';
import ProgressiveImage from './ProgressiveImage';
import ImageWithFallback from './ImageWithFallback';
import { generateSeoFilename } from '../utils/imageUtils';

const ImageSEOExample: React.FC = () => {
  // Example of generating SEO-friendly filenames
  const originalFilename = "Medical Team Photo";
  const seoFilename = generateSeoFilename(originalFilename);
  
  return (
    <div className="space-y-12 py-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">1. Basic Optimized Image</h2>
        <OptimizedImage
          src="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Medical emergency team responding to a call in São Paulo"
          width={800}
          height={533}
          className="rounded-lg shadow-md"
        />
        <p className="text-sm text-gray-600 mt-2">
          ✓ Descriptive alt text with keywords<br />
          ✓ Native lazy loading<br />
          ✓ Width and height attributes to prevent layout shifts
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">2. Responsive Image with Art Direction</h2>
        <ResponsiveImage
          src="https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Ambulance service with UTI mobile for emergency medical transport in São Paulo"
          width={800}
          height={533}
          usage="hero"
          priority={true}
        />
        <p className="text-sm text-gray-600 mt-2">
          ✓ WebP format with fallbacks<br />
          ✓ Multiple resolutions with srcset<br />
          ✓ Priority loading for above-the-fold content
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">3. Advanced Lazy Loading with Intersection Observer</h2>
        <LazyImage
          src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Family protected by emergency medical services in Grande São Paulo"
          width={800}
          height={533}
          placeholderColor="#e0f2fe"
        />
        <p className="text-sm text-gray-600 mt-2">
          ✓ Intersection Observer for efficient loading<br />
          ✓ Colored placeholder until image loads<br />
          ✓ Maintains aspect ratio to prevent layout shifts
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">4. Progressive Loading with Blur-up Effect</h2>
        <ProgressiveImage
          lowQualitySrc="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=50"
          highQualitySrc="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Medical professionals providing emergency care in São Paulo hospital"
          width={800}
          height={533}
          className="rounded-lg"
        />
        <p className="text-sm text-gray-600 mt-2">
          ✓ Low-quality placeholder image<br />
          ✓ Smooth transition to high-quality image<br />
          ✓ Better perceived performance
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">5. Image with Fallback</h2>
        <ImageWithFallback
          src="https://example.com/broken-image.jpg"
          fallbackSrc="https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Medical emergency response team in São Paulo"
          width={800}
          height={533}
          className="rounded-lg"
        />
        <p className="text-sm text-gray-600 mt-2">
          ✓ Graceful handling of broken images<br />
          ✓ Maintains user experience when images fail to load
        </p>
      </section>
      
      <section className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">SEO Filename Example</h2>
        <div className="flex items-center space-x-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm font-mono">Original: <span className="text-red-500">{originalFilename}.jpg</span></p>
            <p className="text-sm font-mono">SEO-friendly: <span className="text-green-500">{seoFilename}.jpg</span></p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              ✓ Lowercase letters<br />
              ✓ Hyphens between words<br />
              ✓ Descriptive keywords
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ImageSEOExample;