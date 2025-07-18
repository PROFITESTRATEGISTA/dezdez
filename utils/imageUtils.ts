/**
 * Utility functions for image optimization
 */

/**
 * Generates a proper SEO-friendly filename from a title or description
 * @param title The original title or description
 * @returns SEO-friendly filename
 */
export const generateSeoFilename = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .trim();
};

/**
 * Generates a complete image srcset for responsive images
 * @param basePath The base path of the image
 * @param filename The filename without extension
 * @param extension The file extension (jpg, png, webp)
 * @param widths Array of widths to generate
 * @returns Formatted srcset string
 */
export const generateSrcSet = (
  basePath: string,
  filename: string,
  extension: string,
  widths: number[] = [300, 600, 900, 1200]
): string => {
  return widths
    .map(width => `${basePath}/${filename}-${width}w.${extension} ${width}w`)
    .join(', ');
};

/**
 * Generates appropriate sizes attribute based on image usage
 * @param usage Where the image is used (hero, thumbnail, gallery)
 * @returns Sizes attribute string
 */
export const generateSizes = (usage: 'hero' | 'thumbnail' | 'gallery' | 'content'): string => {
  switch (usage) {
    case 'hero':
      return '(max-width: 768px) 100vw, 100vw';
    case 'thumbnail':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    case 'gallery':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw';
    case 'content':
    default:
      return '(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw';
  }
};

/**
 * Calculates aspect ratio for an image
 * @param width Image width
 * @param height Image height
 * @returns CSS aspect-ratio value
 */
export const calculateAspectRatio = (width: number, height: number): string => {
  return `${width} / ${height}`;
};

/**
 * Generates alt text from filename if none provided
 * @param filename The image filename
 * @returns Generated alt text
 */
export const generateAltFromFilename = (filename: string): string => {
  return filename
    .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
    .replace(/\.\w+$/, '') // Remove file extension
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};