/**
 * Utility functions for client-side image compression and optimization
 * Note: For production use, server-side or build-time optimization is preferred
 */

/**
 * Compresses an image file to a specified quality
 * @param file The image file to compress
 * @param maxWidthOrHeight Maximum width or height to resize to
 * @param quality Compression quality (0-1)
 * @returns Promise with the compressed file
 */
export const compressImage = async (
  file: File,
  maxWidthOrHeight: number = 1200,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = Math.round(height * maxWidthOrHeight / width);
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = Math.round(width * maxWidthOrHeight / height);
            height = maxWidthOrHeight;
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to file
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not create blob'));
              return;
            }
            
            // Create new file with original name but compressed
            const newFile = new File(
              [blob],
              file.name,
              {
                type: file.type,
                lastModified: Date.now()
              }
            );
            
            resolve(newFile);
          },
          file.type,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
  });
};

/**
 * Generates a WebP version of an image if browser supports it
 * @param file The image file to convert
 * @param quality Compression quality (0-1)
 * @returns Promise with the WebP file or original if not supported
 */
export const convertToWebP = async (
  file: File,
  quality: number = 0.8
): Promise<File> => {
  // Check if browser supports WebP
  const canvas = document.createElement('canvas');
  if (!canvas.toDataURL('image/webp').startsWith('data:image/webp')) {
    return file; // WebP not supported, return original
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        
        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not create blob'));
              return;
            }
            
            // Create new file with WebP extension
            const fileName = file.name.substring(0, file.name.lastIndexOf('.')) + '.webp';
            const newFile = new File(
              [blob],
              fileName,
              {
                type: 'image/webp',
                lastModified: Date.now()
              }
            );
            
            resolve(newFile);
          },
          'image/webp',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
  });
};