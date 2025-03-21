"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SecureImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function SecureImage({ src, alt, width = 800, height = 600, className }: SecureImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Local placeholder path
  const placeholderImage = '/placeholders/default.jpg';

  useEffect(() => {
    if (!src) {
      setImageSrc(placeholderImage);
      setIsLoading(false);
      return;
    }
    
    // Check if src is a placeholder
    if (src.startsWith('image-placeholder-')) {
      console.log('Detected placeholder, fetching real image via API:', src);
      
      // Fetch the actual image for this placeholder
      fetch(`/api/image-map?postId=${window.location.pathname.split('/').pop()}`)
        .then(res => res.json())
        .then(imageMap => {
          // Find the URL for this placeholder
          const realUrl = imageMap[src];
          
          if (realUrl) {
            if (realUrl.startsWith('/')) {
              // Local image path
              console.log('Using local image:', realUrl);
              setImageSrc(realUrl);
              setIsLoading(false);
            } else {
              // External URL needs to be proxied
              const urlHash = btoa(realUrl).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
              
              // Call image proxy
              fetch(`/api/image-proxy?url=${encodeURIComponent(realUrl)}&hash=${urlHash}`)
                .then(response => response.json())
                .then(data => {
                  if (data.imagePath) {
                    console.log('Using blob/cached image:', data.imagePath);
                    setImageSrc(data.imagePath);
                  } else {
                    throw new Error('No image path returned');
                  }
                  setIsLoading(false);
                })
                .catch(err => {
                  console.error('Image proxy error:', err);
                  setImageSrc(placeholderImage);
                  setIsLoading(false);
                });
            }
          } else {
            // Placeholder not found in map
            console.warn('Placeholder not found in image map:', src);
            setImageSrc(placeholderImage);
            setIsLoading(false);
          }
        })
        .catch(err => {
          console.error('Error fetching image map:', err);
          setImageSrc(placeholderImage);
          setIsLoading(false);
        });
      return;
    }
    
    // Direct detection of AWS S3 URLs - this is the key fix
    if (src.includes('amazonaws.com') || src.includes('prod-files-secure.s3')) {
      console.log('Detected direct S3 URL, proxying:', src.substring(0, 30) + '...');
      const urlHash = btoa(src).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      
      // Proxy through our API
      fetch(`/api/image-proxy?url=${encodeURIComponent(src)}&hash=${urlHash}`)
        .then(response => response.json())
        .then(data => {
          if (data.imagePath) {
            setImageSrc(data.imagePath);
          } else {
            throw new Error('No image path returned');
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error proxying S3 image:', err);
          // Fallback to direct URL as temporary solution
          setImageSrc(src);
          setIsLoading(false);
        });
      return;
    }
    
    // Handle all other direct image URLs
    setImageSrc(src);
    setIsLoading(false);
  }, [src]);

  // Use span for loading state to avoid nesting errors
  if (isLoading) {
    return <span className="inline-block animate-pulse bg-gray-200 dark:bg-gray-800 rounded" style={{ width, height }} />;
  }

  if (error) {
    return <span className="text-red-500 inline-block">{error}</span>;
  }

  if (!imageSrc) {
    return null;
  }

  return (
    <Image 
      src={imageSrc}
      alt={alt || "Blog image"}
      width={width}
      height={height}
      className={className || "rounded-md my-4 max-w-full h-auto"}
      unoptimized={imageSrc.includes('amazonaws.com') || imageSrc.includes('blob.vercel')} 
    />
  );
}