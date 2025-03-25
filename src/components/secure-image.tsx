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
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    async function resolveImage() {
      try {
        setLoading(true);
        console.log(`Resolving image: ${src}`);
        console.log(`Available mappings:`, imageMap);
        
        // If src is already a fully qualified URL (not a placeholder), use it directly
        if (src.startsWith('http') && !src.includes('image-placeholder')) {
          console.log(`Using direct URL: ${src}`);
          setImageSrc(src);
          setLoading(false);
          return;
        }
        
        // Check if we have a direct mapping in imageMap
        if (imageMap[src]) {
          console.log(`Found direct mapping for ${src} -> ${imageMap[src]}`);
          setImageSrc(imageMap[src]);
          setLoading(false);
          return;
        }
        
        // Handle placeholders with or without the prefix
        const isPlaceholder = src.startsWith('image-placeholder-') || src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png');
        
        if (isPlaceholder) {
          // Extract filename, handling both with and without the prefix
          const filename = src.startsWith('image-placeholder-') 
            ? src.replace('image-placeholder-', '') 
            : src;
          
          console.log(`Processing as placeholder with filename: ${filename}`);
          
          try {
            // Extract base filename without extension
            const filenameBase = filename.split('.')[0];
            console.log(`Base filename: ${filenameBase}`);
            
            // 1. First strategy: Check for a direct URL that contains this filename
            const directBlobMatch = Object.values(imageMap).find(url => 
              url.includes(filename) || 
              url.includes(filenameBase)
            );
            
            if (directBlobMatch) {
              console.log(`Found direct blob URL match: ${directBlobMatch}`);
              setImageSrc(directBlobMatch);
              setLoading(false);
              return;
            }
            
            // 2. Second strategy: Super flexible fuzzy matching
            const fuzzyMatch = Object.entries(imageMap).find(([key, value]) => {
              // If exact match of the key
              if (key === src) return true;
              
              // Get the filename part from the key
              const keyFilename = key.startsWith('image-placeholder-')
                ? key.replace('image-placeholder-', '')
                : key;
              
              // Get base name without extension
              const keyBase = keyFilename.split('.')[0];
              
              // Check all possible matches:
              return (
                // Exact match with filename
                keyFilename === filename || 
                // Base filename matches (ignoring extension)
                keyBase === filenameBase || 
                // Key contains our filename or vice versa
                keyFilename.includes(filename) || 
                filename.includes(keyFilename) ||
                // Base filename is contained in key or vice versa
                (filenameBase && keyFilename.includes(filenameBase)) ||
                (keyBase && filename.includes(keyBase)) ||
                // URL contains our filename or base
                value.includes(filename) ||
                (filenameBase && value.includes(filenameBase)) ||
                // Special case for .jpg.jpg issue - look for double extensions
                value.includes(`${filename}.jpg`) ||
                value.includes(`${filenameBase}.jpg.jpg`)
              );
            });
            
            if (fuzzyMatch) {
              console.log(`Found fuzzy match: ${fuzzyMatch[0]} -> ${fuzzyMatch[1]}`);
              setImageSrc(fuzzyMatch[1]);
              setLoading(false);
              return;
            }
            
            // 3. If we have a blob that contains double extensions, try that
            const doubleExtensionMatch = Object.values(imageMap).find(url => {
              const urlParts = url.split('/');
              const blobFilename = urlParts[urlParts.length - 1].split('?')[0];
              return blobFilename.includes(`${filenameBase}.jpg.jpg`) || 
                     blobFilename.includes(`${filenameBase}.jpeg.jpg`) || 
                     blobFilename.includes(`${filenameBase}.png.jpg`);
            });
            
            if (doubleExtensionMatch) {
              console.log(`Found double extension match: ${doubleExtensionMatch}`);
              setImageSrc(doubleExtensionMatch);
              setLoading(false);
              return;
            }
            
            // 4. Last resort - try the API
            console.log(`Trying API as last resort for ${filename}`);
            const response = await fetch(`/api/image-proxy?filename=${filename}&postId=${postId}`);
            if (!response.ok) throw new Error(`API returned ${response.status}`);
            
            const data = await response.json();
            if (data.imagePath) {
              console.log(`API returned image path: ${data.imagePath}`);
              setImageSrc(data.imagePath);
              setLoading(false);
              return;
            } else {
              throw new Error('No image path returned from API');
            }
          } catch (error) {
            console.error('Error loading image:', error);
            setDebugInfo(`Failed to load: ${src}, Error: ${error instanceof Error ? error.message : String(error)}`);
            setError(true);
          }
        } else {
          // Not a placeholder or URL - could be a local path
          console.log(`Using as local path: ${src}`);
          setImageSrc(src);
          setLoading(false);
          return;
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error resolving image:', err);
        setDebugInfo(`General error: ${err instanceof Error ? err.message : String(err)}`);
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
      <div className={`flex flex-col items-center justify-center border border-gray-300 dark:border-gray-700 rounded-md ${className || 'h-48'}`}>
        <span className="text-gray-500">Failed to load image</span>
        {debugInfo && process.env.NODE_ENV === 'development' && (
          <span className="text-xs text-red-500 mt-1 max-w-full px-2 text-center">{debugInfo}</span>
        )}
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