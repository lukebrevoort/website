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
      console.log('Using local placeholder for:', src);
      setImageSrc(placeholderImage);
      setIsLoading(false);
      return;
    }
    
    // Handle AWS S3 URLs
    if (src.includes('prod-files-secure.s3') || 
        src.includes('amazonaws.com') || 
        src.includes('X-Amz-Credential')) {
      
      // Create a hash for the URL
      const urlHash = btoa(src).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      
      console.log('Proxying S3 image:', src.substring(0, 30) + '...');
      
      // Use our proxy API
      fetch(`/api/image-proxy?url=${encodeURIComponent(src)}&hash=${urlHash}`)
        .then(response => {
          if (!response.ok) throw new Error(`Proxy error: ${response.status}`);
          return response.json();
        })
        .then(data => {
          if (data.imagePath) {
            console.log('Using cached image:', data.imagePath);
            setImageSrc(data.imagePath);
          } else {
            throw new Error('No image path returned');
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Image proxy error:', err);
          // Fallback to placeholder
          setImageSrc(placeholderImage);
          setError('Failed to load image');
          setIsLoading(false);
        });
    } else {
      // Regular URL, use directly
      console.log('Using direct image URL:', src);
      setImageSrc(src);
      setIsLoading(false);
    }
  }, [src]);

  // Use span instead of div for loading state to avoid nesting errors
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
    />
  );
}