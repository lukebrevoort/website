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

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }
    
    // Process URLs with AWS credentials
    if (src.includes('prod-files-secure.s3') || 
        src.includes('amazonaws.com') || 
        src.includes('X-Amz-Credential')) {
      
      // Create a simple hash from URL
      const urlHash = btoa(src).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      
      // Fetch via proxy
      console.log(`Proxying image via /api/image-proxy`);
      fetch(`/api/image-proxy?url=${encodeURIComponent(src)}&hash=${urlHash}`)
        .then(response => {
          if (!response.ok) throw new Error(`Proxy response: ${response.status}`);
          return response.json();
        })
        .then(data => {
          console.log('Image proxy response:', data);
          if (data.imagePath) {
            setImageSrc(data.imagePath);
            setIsLoading(false);
          } else {
            throw new Error('No image path returned');
          }
        })
        .catch(err => {
          console.error('Image proxy error:', err);
          setError(err.message);
          setIsLoading(false);
          // Fallback to direct URL as last resort
          setImageSrc(src);
        });
    } else {
      // Non-AWS URLs can be used directly
      setImageSrc(src);
      setIsLoading(false);
    }
  }, [src]);

  // Use spans instead of divs for loading/error states to avoid nesting issues
  if (isLoading) {
    // Use a span for loading state to avoid nesting issues when inside <p> tags
    return <span className="inline-block bg-gray-200 dark:bg-gray-800 rounded animate-pulse" style={{ width, height, maxWidth: '100%' }} />;
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
    />
  );
}