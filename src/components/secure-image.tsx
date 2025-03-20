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
    if (!src) return;
    
    // Only proxy Notion S3 URLs
    if (src.includes('prod-files-secure.s3') || 
        src.includes('amazonaws.com') || 
        src.includes('X-Amz-Credential')) {
      
      // Create a hash of the original URL to use as the filename
      // Using a simplified hash approach that works in browser
      const urlHash = btoa(src).replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
      
      // Fetch from our proxy
      fetch(`/api/image-proxy?url=${encodeURIComponent(src)}&hash=${urlHash}`)
        .then(response => {
          if (!response.ok) throw new Error('Failed to proxy image');
          return response.json();
        })
        .then(data => {
          setImageSrc(data.imagePath);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching proxied image:', err);
          setError('Failed to load image');
          setIsLoading(false);
        });
    } else {
      // For non-S3 images, use the source directly
      setImageSrc(src);
      setIsLoading(false);
    }
  }, [src]);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded" style={{ width, height }} />;
  }

  if (error || !imageSrc) {
    return <div className="text-red-500">Failed to load image: {error}</div>;
  }

  return (
    <Image 
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}