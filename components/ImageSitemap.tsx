import React from 'react';
import { Helmet } from 'react-helmet';

interface ImageSitemapProps {
  domain: string;
  images: Array<{
    url: string;
    loc: string;
    title: string;
    caption?: string;
    geoLocation?: string;
    license?: string;
  }>;
}

/**
 * Component to generate image sitemap data
 * Note: This is for demonstration. In production, sitemaps should be
 * generated server-side or at build time.
 */
const ImageSitemap: React.FC<ImageSitemapProps> = ({ domain, images }) => {
  // Generate XML sitemap content
  const generateSitemapXML = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
    
    // Group images by page URL
    const imagesByPage: Record<string, typeof images> = {};
    
    images.forEach(image => {
      if (!imagesByPage[image.loc]) {
        imagesByPage[image.loc] = [];
      }
      imagesByPage[image.loc].push(image);
    });
    
    // Generate entries for each page
    Object.entries(imagesByPage).forEach(([pageUrl, pageImages]) => {
      xml += '  <url>\n';
      xml += `    <loc>${domain}${pageUrl}</loc>\n`;
      
      // Add each image for this page
      pageImages.forEach(image => {
        xml += '    <image:image>\n';
        xml += `      <image:loc>${domain}${image.url}</image:loc>\n`;
        xml += `      <image:title>${image.title}</image:title>\n`;
        
        if (image.caption) {
          xml += `      <image:caption>${image.caption}</image:caption>\n`;
        }
        
        if (image.geoLocation) {
          xml += `      <image:geo_location>${image.geoLocation}</image:geo_location>\n`;
        }
        
        if (image.license) {
          xml += `      <image:license>${image.license}</image:license>\n`;
        }
        
        xml += '    </image:image>\n';
      });
      
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    return xml;
  };

  // In a real application, you would generate this file at build time
  // This is just for demonstration purposes
  const sitemapUrl = `${domain}/image-sitemap.xml`;

  return (
    <Helmet>
      <link rel="sitemap" type="application/xml" href={sitemapUrl} />
    </Helmet>
  );
};

export default ImageSitemap;