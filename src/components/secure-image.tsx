import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import crypto from 'crypto';

interface SecureImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  postId?: string;
  imageMap?: Record<string, string>;
}

export default function SecureImage({ 
  src, 
  alt, 
  width = 800, 
  height = 600, 
  className, 
  postId,
  imageMap = {} 
}: SecureImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const placeholderImage = '/placeholders/default.jpg';
  
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    resolveImage();
    
    return () => {
      controller.abort();
    };
    
    async function resolveImage() {
      try {
        console.log('SecureImage processing src:', src);
        
        if (!src) {
          console.log('Empty src, using placeholder');
          setImageSrc(placeholderImage);
          setIsLoading(false);
          return;
        }
        
        // Handle Vercel Blob URLs directly
        if (src.includes('vercel-blob.com') || src.includes('blob.vercel-storage.com')) {
          console.log('Direct blob URL detected:', src.substring(0, 30) + '...');
          setImageSrc(src);
          setIsLoading(false);
          return;
        }
        
        // Handle image placeholders
        if (src.startsWith('image-placeholder-')) {
          console.log('Processing placeholder:', src);
          
          // Priority 1: Check existing imageMap prop
          if (imageMap && imageMap[src]) {
            const mappedUrl = imageMap[src];
            console.log('Found mapping in props:', src, '->', mappedUrl.substring(0, 30) + '...');
            
            // If it's already a blob URL, use it directly
            if (mappedUrl.includes('vercel-blob.com') || mappedUrl.includes('blob.vercel-storage.com')) {
              console.log('Using blob URL from map:', mappedUrl.substring(0, 30) + '...');
              setImageSrc(mappedUrl);
              setIsLoading(false);
              return;
            }
            
            // Otherwise, try to resolve via proxy
            try {
              // Extract the hash from the placeholder
              const hash = src.replace('image-placeholder-', '');
              
              console.log('Proxying image via API...');
              const response = await fetch(
                `/api/image-proxy?url=${encodeURIComponent(mappedUrl)}&hash=${hash}`,
                { signal }
              );
              
              if (!response.ok) {
                throw new Error(`Image proxy failed: ${response.status}`);
              }
              
              const data = await response.json();
              
              if (data.imagePath) {
                console.log('Received blob URL:', data.imagePath.substring(0, 30) + '...');
                setImageSrc(data.imagePath);
                setIsLoading(false);
                return;
              }
            } catch (proxyErr) {
              if (signal.aborted) return;
              console.error('Error with proxy resolution:', proxyErr);
              
              // Continue to next resolution method
            }
            
            // Priority 2: Try direct hash lookup
            try {
              const hash = src.replace('image-placeholder-', '');
              console.log('Trying direct hash lookup:', hash);
              const response = await fetch(`/api/image-proxy-check?hash=${hash}`, { signal });
              const data = await response.json();
              
              if (data.imagePath && !data.error) {
                console.log('Found image via hash check:', data.imagePath.substring(0, 30) + '...');
                setImageSrc(data.imagePath);
                setIsLoading(false);
                return;
              }
            } catch (err) {
              if (signal.aborted) return;
              console.error('Hash check error:', err);
              // Continue to next resolution method
            }
            
            // Priority 3: Try API image map
            try {
              const currentPostId = postId || window.location.pathname.split('/').pop();
              
              if (!currentPostId) {
                console.error('Could not determine post ID');
                throw new Error('Missing post ID');
              }
              
              console.log(`Fetching image map for post ${currentPostId}`);
              
              const mapResponse = await fetch(`/api/image-map?postId=${currentPostId}`, { signal });
              const fetchedImageMap = await mapResponse.json();
              
              console.log('Received image map:', Object.keys(fetchedImageMap).length, 'entries');
              
              if (fetchedImageMap[src]) {
                const mappedUrl = fetchedImageMap[src];
                console.log('Found mapping:', src, '->', mappedUrl.substring(0, 30) + '...');
                
                if (mappedUrl.includes('vercel-blob.com') || mappedUrl.includes('blob.vercel-storage.com')) {
                  console.log('Using blob URL directly:', mappedUrl.substring(0, 30) + '...');
                  setImageSrc(mappedUrl);
                  setIsLoading(false);
                  return;
                }
                
                // Extract hash from placeholder
                const hash = src.replace('image-placeholder-', '');
                
                // Try to proxy the image
                const proxyResponse = await fetch(
                  `/api/image-proxy?url=${encodeURIComponent(mappedUrl)}&hash=${hash}`,
                  { signal }
                );
                const proxyData = await proxyResponse.json();
                
                if (proxyData.imagePath) {
                  console.log('Received blob URL:', proxyData.imagePath.substring(0, 30) + '...');
                  setImageSrc(proxyData.imagePath);
                  setIsLoading(false);
                  return;
                }
              }
            } catch (err) {
              if (signal.aborted) return;
              console.error('Error with image map resolution:', err);
            }
          }
          
          console.log('All resolution methods failed, using placeholder');
          setImageSrc(placeholderImage);
          setIsLoading(false);
          return;
        }
        
        // Handle AWS URLs
        if (src.includes('amazonaws.com') || src.includes('prod-files-secure.s3')) {
          console.log('Detected AWS URL, proxying:', src.substring(0, 30) + '...');
          
          // Create a hash for the URL
          const urlHash = crypto
            .createHash('sha256')
            .update(src)
            .digest('base64')
            .replace(/[^a-zA-Z0-9]/g, '')
            .substring(0, 32);
          
          try {
            const response = await fetch(
              `/api/image-proxy?url=${encodeURIComponent(src)}&hash=${urlHash}`,
              { signal }
            );
            const data = await response.json();
            
            if (data.imagePath) {
              console.log('Received blob URL for AWS image:', data.imagePath.substring(0, 30) + '...');
              setImageSrc(data.imagePath);
              setIsLoading(false);
              return;
            }
          } catch (err) {
            if (signal.aborted) return;
            console.error('Error proxying AWS image:', err);
            setImageSrc(placeholderImage);
            setIsLoading(false);
            return;
          }
        }
        
        // For all other cases, use the src directly
        console.log('Using src directly:', src);
        setImageSrc(src);
        setIsLoading(false);
      } catch (err: unknown) {
        if (signal.aborted) return;
        console.error('Error resolving image:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load image: ${errorMessage}`);
        setImageSrc(placeholderImage);
        setIsLoading(false);
      }
    }
  }, [src, alt, postId, imageMap]);
  
  if (isLoading) {
    return (
      <div 
        className="inline-block animate-pulse bg-gray-200 dark:bg-gray-800 rounded" 
        style={{ width, height }}
      />
    );
  }
  
  if (error) {
    return <div className="text-red-500 inline-block">{error}</div>;
  }
  
  if (imageSrc) {
    return (
      <Image
        src={imageSrc}
        alt={alt || "Blog image"}
        width={width}
        height={height}
        className={className || "rounded-md my-4 max-w-full h-auto"}
        unoptimized={imageSrc.includes('amazonaws.com')}
      />
    );
  }
  
  return null;
}