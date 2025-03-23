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
      // Force a cache-busting reload if needed
      const cacheBuster = new Date().getTime();
      const apiUrlWithCache = (url: string) => `${url}${url.includes('?') ? '&' : '?'}_cb=${cacheBuster}`;
          
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
          
          // Extract the hash from the placeholder
          const hash = src.replace('image-placeholder-', '');
          console.log('Extracted hash:', hash);
          
          // APPROACH 1: Try direct blob check first
          try {
            console.log(`Checking if blob already exists for hash: ${hash}`);
            // Apply cache-busting
            const response = await fetch(apiUrlWithCache(`/api/image-proxy-check?hash=${hash}`), { signal });
            
            if (response.ok) {
              const data = await response.json();
              
              if (data.imagePath) {
                console.log('Found image directly from blob storage:', data.imagePath);
                setImageSrc(data.imagePath);
                setIsLoading(false);
                return;
              }
            }
          } catch (err) {
            if (signal.aborted) return;
            console.error('Direct blob check failed:', err);
          }
          
          // APPROACH 2: Use imageMap prop if available
          if (imageMap && imageMap[src]) {
            const mappedUrl = imageMap[src];
            console.log('Found mapping in props:', src, '->', mappedUrl);
            
            if (mappedUrl.includes('vercel-blob.com') || mappedUrl.includes('blob.vercel-storage.com')) {
              console.log('Using blob URL from map:', mappedUrl.substring(0, 30) + '...');
              setImageSrc(mappedUrl);
              setIsLoading(false);
              return;
            }
            
            // If it's not a blob URL but some other URL, try to proxy it
            try {
              console.log('Proxying image via API...');
              // Apply cache-busting
              const response = await fetch(
                apiUrlWithCache(`/api/image-proxy?url=${encodeURIComponent(mappedUrl)}&hash=${hash}`),
                { signal }
              );
              
              if (response.ok) {
                const data = await response.json();
                
                if (data.imagePath) {
                  console.log('Received blob URL:', data.imagePath.substring(0, 30) + '...');
                  setImageSrc(data.imagePath);
                  setIsLoading(false);
                  return;
                }
              }
            } catch (proxyErr) {
              if (signal.aborted) return;
              console.error('Error with proxy resolution:', proxyErr);
            }
          }
          
          // APPROACH 3: Try to get image map from API
          try {
            const currentPostId = postId || window.location.pathname.split('/').pop();
            
            if (currentPostId) {
              console.log(`Fetching image map for post ${currentPostId}`);
              // Apply cache-busting
              const mapResponse = await fetch(apiUrlWithCache(`/api/image-map?postId=${currentPostId}`), { signal });
              
              if (mapResponse.ok) {
                const fetchedImageMap = await mapResponse.json();
                console.log('Received image map:', Object.keys(fetchedImageMap).length, 'entries');
                
                if (fetchedImageMap[src]) {
                  const mappedUrl = fetchedImageMap[src];
                  console.log('Found mapping in API:', src, '->', mappedUrl.substring(0, 30) + '...');
                  
                  if (mappedUrl.includes('vercel-blob.com') || mappedUrl.includes('blob.vercel-storage.com')) {
                    setImageSrc(mappedUrl);
                    setIsLoading(false);
                    return;
                  }
                  
                  // If it's not a blob URL, try to proxy it
                  // Apply cache-busting
                  const proxyResponse = await fetch(
                    apiUrlWithCache(`/api/image-proxy?url=${encodeURIComponent(mappedUrl)}&hash=${hash}`),
                    { signal }
                  );
                  
                  if (proxyResponse.ok) {
                    const proxyData = await proxyResponse.json();
                    
                    if (proxyData.imagePath) {
                      setImageSrc(proxyData.imagePath);
                      setIsLoading(false);
                      return;
                    }
                  }
                }
              }
            }
          } catch (err) {
            if (signal.aborted) return;
            console.error('Error with image map resolution:', err);
          }
          
          // APPROACH 4: Last resort - use placeholder
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
            // Apply cache-busting
            const response = await fetch(
              apiUrlWithCache(`/api/image-proxy?url=${encodeURIComponent(src)}&hash=${urlHash}`),
              { signal }
            );
            
            if (response.ok) {
              const data = await response.json();
              
              if (data.imagePath) {
                console.log('Received blob URL for AWS image:', data.imagePath.substring(0, 30) + '...');
                setImageSrc(data.imagePath);
                setIsLoading(false);
                return;
              }
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
      <div className="relative w-full" style={{ minHeight: '100px' }}>
        <Image
          src={imageSrc}
          alt={alt || "Blog image"}
          width={width}
          height={height}
          className={className || "rounded-md my-4 max-w-full h-auto"}
          unoptimized={imageSrc.includes('amazonaws.com')}
        />
      </div>
    );
  }
  
  return null;
}