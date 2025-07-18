import React, { useState, useRef } from 'react';
import { compressImage, convertToWebP } from '../utils/imageCompression';
import { generateSeoFilename } from '../utils/imageUtils';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  className?: string;
}

/**
 * Component for uploading and optimizing images client-side
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  maxSize = 5, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setError(null);
    
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError(`Tipo de arquivo não permitido. Use: ${allowedTypes.join(', ')}`);
      return;
    }
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Arquivo muito grande. Tamanho máximo: ${maxSize}MB`);
      return;
    }
    
    setIsUploading(true);
    setOriginalSize(file.size);
    
    try {
      // Generate SEO-friendly filename
      const fileExtension = file.name.split('.').pop() || '';
      const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
      const seoFilename = generateSeoFilename(baseName) + '.' + fileExtension;
      
      // Create a new file with SEO-friendly name
      const renamedFile = new File([file], seoFilename, { type: file.type });
      
      // Compress image
      const compressedFile = await compressImage(renamedFile, 1200, 0.8);
      
      // Try to convert to WebP if browser supports it
      let finalFile = compressedFile;
      try {
        finalFile = await convertToWebP(compressedFile);
      } catch (err) {
        console.log('WebP conversion not supported, using compressed original');
      }
      
      setOptimizedSize(finalFile.size);
      
      // Generate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(finalFile);
      
      // Call the callback with the optimized image
      onImageUpload(finalFile);
    } catch (err) {
      setError('Erro ao processar imagem. Tente novamente.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const calculateSavings = (): string => {
    if (originalSize === 0 || optimizedSize === 0) return '0%';
    const savings = ((originalSize - optimizedSize) / originalSize) * 100;
    return savings.toFixed(1) + '%';
  };

  return (
    <div className={`image-uploader ${className}`}>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={allowedTypes.join(',')}
          className="hidden"
        />
        
        {!preview ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isUploading}
          >
            {isUploading ? 'Processando...' : 'Selecionar Imagem'}
          </button>
        ) : (
          <div className="space-y-4">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-64 mx-auto rounded-lg shadow-md" 
            />
            
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isUploading}
              >
                Trocar Imagem
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Tamanho original: {formatFileSize(originalSize)}</p>
              <p>Tamanho otimizado: {formatFileSize(optimizedSize)}</p>
              <p>Economia: {calculateSavings()}</p>
            </div>
          </div>
        )}
        
        {error && (
          <p className="mt-2 text-red-600 text-sm">{error}</p>
        )}
        
        <p className="mt-4 text-sm text-gray-500">
          Formatos permitidos: {allowedTypes.map(type => type.replace('image/', '').toUpperCase()).join(', ')}
          <br />
          Tamanho máximo: {maxSize}MB
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;