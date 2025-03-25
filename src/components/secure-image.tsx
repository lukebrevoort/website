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

  // Smart image resolver - centralized logic for finding the right image
  const smartResolveImage = (
    source: string,
    map: Record<string, string>
  ): string | null => {
    console.log(`Smart resolving image: ${source}`);
    
    // Direct lookup - fastest path
    if (map[source]) {
      console.log(`✓ Direct mapping found: ${map[source]}`);
      return map[source];
    }
    
    // Extract key data from source
    const isPlaceholder = source.startsWith('image-placeholder-');
    const rawFilename = isPlaceholder 
      ? source.replace('image-placeholder-', '') 
      : source;
    const baseFilename = rawFilename.split('.')[0].toLowerCase();
    
    // Strategy 1: Case-insensitive exact match
    const caseInsensitiveMatch = Object.entries(map).find(([key]) => 
      key.toLowerCase() === source.toLowerCase()
    );
    if (caseInsensitiveMatch) {
      console.log(`✓ Case-insensitive match found: ${caseInsensitiveMatch[1]}`);
      return caseInsensitiveMatch[1];
    }
    
    // Strategy 2: Look for URL containing the filename
    const filenameInUrlMatch = Object.values(map).find(url => 
      url.toLowerCase().includes(baseFilename)
    );
    if (filenameInUrlMatch) {
      console.log(`✓ Filename found in URL: ${filenameInUrlMatch}`);
      return filenameInUrlMatch;
    }
    
    // Strategy 3: Fuzzy matching on keys
    let bestMatchScore = 0;
    let bestMatchUrl = null;
    
    Object.entries(map).forEach(([key, url]) => {
      const keyBase = key.startsWith('image-placeholder-') 
        ? key.replace('image-placeholder-', '').split('.')[0].toLowerCase()
        : key.split('.')[0].toLowerCase();
      
      // Calculate similarity score (higher is better)
      let score = 0;
      
      // Direct inclusion of base names
      if (keyBase.includes(baseFilename) || baseFilename.includes(keyBase)) {
        score += 30;
      }
      
      // URL contains filename
      if (url.toLowerCase().includes(baseFilename)) {
        score += 20;
      }
      
      // Check for common words between filenames
      const baseWords = baseFilename.split(/[-_\s]+/);
      const keyWords = keyBase.split(/[-_\s]+/);
      const commonWords = baseWords.filter(word => 
        word.length > 2 && keyWords.some(keyWord => keyWord.includes(word) || word.includes(keyWord))
      );
      
      if (commonWords.length > 0) {
        score += commonWords.length * 15;
      }
      
      // Keep track of best match
      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatchUrl = url;
      }
    });
    
    if (bestMatchUrl && bestMatchScore > 25) {
      console.log(`✓ Fuzzy match found (score ${bestMatchScore}): ${bestMatchUrl}`);
      return bestMatchUrl;
    }
    
    console.log(`✗ No match found for ${source}`);
    return null;
  };

  useEffect(() => {
    async function resolveImage() {
      try {
        setLoading(true);
        console.log(`Resolving image: ${src}`);
        
        // If src is already a fully qualified URL (not a placeholder), use it directly
        if (src.startsWith('http') && !src.includes('image-placeholder')) {
          console.log(`Using direct URL: ${src}`);
          setImageSrc(src);
          setLoading(false);
          return;
        }
        
        // Use the smart resolver to find the best match
        const resolvedUrl = smartResolveImage(src, imageMap);
        
        if (resolvedUrl) {
          setImageSrc(resolvedUrl);
          setLoading(false);
          return;
        }
        
        // If smart resolver failed, try the image-proxy API as last resort
        if (src.startsWith('image-placeholder-')) {
          const filename = src.replace('image-placeholder-', '');
          console.log(`Trying API for ${filename}`);
          
          try {
            const response = await fetch(`/api/image-proxy?filename=${encodeURIComponent(filename)}&postId=${postId}`);
            if (!response.ok) throw new Error(`API returned ${response.status}`);
            
            const data = await response.json();
            if (data.imagePath) {
              console.log(`API returned image path: ${data.imagePath}`);
              setImageSrc(data.imagePath);
              setLoading(false);
              return;
            }
            
            throw new Error('No image path returned from API');
          } catch (proxyError) {
            console.error('Image proxy failed:', proxyError);
            throw proxyError;
          }
        }
        
        // No match found anywhere - report error
        setError(true);
        setDebugInfo(`Could not resolve image: ${src}`);
        setLoading(false);
      } catch (err) {
        console.error('Error resolving image:', err);
        setDebugInfo(`Error: ${err instanceof Error ? err.message : String(err)}`);
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
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded max-w-full overflow-auto">
            <p>Source: {src}</p>
            <p>Available mappings: {Object.keys(imageMap).join(', ')}</p>
          </div>
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