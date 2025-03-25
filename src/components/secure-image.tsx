import Image from 'next/image';
import { useState, useEffect } from 'react';

interface SecureImageProps {
  src: string;
  alt: string;
  className?: string;
  postId: string;
  imageMap: Record<string, string>;
}

export default function SecureImage({ src, alt, className, postId, imageMap }: SecureImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function resolveImage() {
      try {
        setLoading(true);
        
        // If src is already a fully qualified URL (not a placeholder), use it directly
        if (src.startsWith('http') && !src.includes('image-placeholder')) {
          setImageSrc(src);
          setLoading(false);
          return;
        }
        
        // Check if we have a direct mapping in imageMap
        if (imageMap[src]) {
          setImageSrc(imageMap[src]);
          setLoading(false);
          return;
        }
        
        // If it's a placeholder but not in the map, try to fetch it from the API
        if (src.startsWith('image-placeholder-')) {
          // Extract filename from placeholder
          const filename = src.replace('image-placeholder-', '');
          
          try {
            // Look for either the exact filename or versions with different extensions
            const filenameBase = filename.split('.')[0]; // Get filename without extension
            
            // Try to find a fuzzy match in the map
            const fuzzyMatch = Object.entries(imageMap).find(([key, value]) => {
              if (key === src) return true; // Direct match
              
              const keyFilename = key.replace('image-placeholder-', '');
              const keyBase = keyFilename.split('.')[0];
              
              return (
                keyFilename === filename || 
                keyBase === filenameBase || 
                (filenameBase && keyFilename.includes(filenameBase)) ||
                (keyBase && filename.includes(keyBase))
              );
            });
            
            if (fuzzyMatch) {
              setImageSrc(fuzzyMatch[1]);
              setLoading(false);
              return;
            }
            
            // As a last resort, try to fetch from API
            const response = await fetch(`/api/image-proxy?filename=${filename}&postId=${postId}`);
            if (!response.ok) throw new Error('Failed to fetch image');
            
            const data = await response.json();
            if (data.imagePath) {
              setImageSrc(data.imagePath);
            } else {
              throw new Error('No image path returned');
            }
          } catch (error) {
            console.error('Error loading image:', error);
            setError(true);
          }
        } else {
          // Not a placeholder or URL - could be a local path
          setImageSrc(src);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error resolving image:', err);
        setError(true);
        setLoading(false);
      }
    }
    
    resolveImage();
  }, [src, imageMap, postId]);

  if (loading) {
    return <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 h-48 rounded-md ${className}`} />;
  }

  if (error || !imageSrc) {
    return (
      <div className={`flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-md ${className || 'h-48'}`}>
        <span className="text-gray-500">Failed to load image</span>
      </div>
    );
  }

  return (
    <Image 
      src={imageSrc} 
      alt={alt} 
      className={className || ''} 
      width={800} 
      height={450} 
      style={{ maxWidth: '100%', height: 'auto' }} 
    />
  );
}