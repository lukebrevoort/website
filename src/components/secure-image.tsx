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
    
    // Handle Vercel Blob URLs directly
    if (src.includes('vercel-blob.com') || src.includes('blob.vercel-storage.com')) {
      console.log('Using direct Vercel Blob URL:', src);
      setImageSrc(src);
      setIsLoading(false);
      return;
    }
    
    if (src.startsWith('image-placeholder-')) {
      console.log('Detected placeholder, fetching real image via API:', src);
      
      // Extract post ID from URL
      const postId = window.location.pathname.split('/').pop();
      
      // Fetch the actual image for this placeholder
      fetch(`/api/image-map?postId=${postId}`)
        .then(res => res.json())
        .then(imageMap => {
          const realUrl = imageMap[src];
          
          if (realUrl) {
            console.log('Found mapping for placeholder:', realUrl);
            
            // Check if it's already a blob URL
            if (realUrl.includes('vercel-blob.com') || realUrl.includes('blob.vercel-storage.com')) {
              console.log('Using Blob URL directly:', realUrl);
              setImageSrc(realUrl);
              setIsLoading(false);
            } 
            // Check if it's a local image path
            else if (realUrl.startsWith('/')) {
              console.log('Using local image:', realUrl);
              setImageSrc(realUrl);
              setIsLoading(false);
            } 
            else {
              console.log('Proxying external URL:', realUrl.substring(0, 30) + '...');
              const urlHash = btoa(realUrl).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
              
              // Call image proxy
              fetch(`/api/image-proxy?url=${encodeURIComponent(realUrl)}&hash=${urlHash}`)
                .then(response => response.json())
                .then(data => {
                  if (data.imagePath) {
                    console.log('Image proxy returned:', data.imagePath);
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
            console.log('Placeholder not found in map, trying direct proxy');
            const hash = src.replace('image-placeholder-', '');
            
            // Check if blob exists with this hash
            fetch(`/api/image-proxy-check?hash=${hash}`)
              .then(response => response.json())
              .then(data => {
                if (data.imagePath) {
                  console.log('Found image in blob storage:', data.imagePath);
                  setImageSrc(data.imagePath);
                } else {
                  console.warn('No image found for placeholder:', src);
                  setImageSrc(placeholderImage);
                }
                setIsLoading(false);
              })
              .catch(err => {
                console.error('Image check error:', err);
                setImageSrc(placeholderImage);
                setIsLoading(false);
              });
          }
        })
        .catch(err => {
          console.error('Error fetching image map:', err);
          setImageSrc(placeholderImage);
          setIsLoading(false);
        });
      return;
    }
    
    // Direct handling of AWS S3 URLs
    if (src.includes('amazonaws.com') || src.includes('prod-files-secure.s3')) {
      console.log('Detected S3 URL, proxying:', src.substring(0, 30) + '...');
      const urlHash = btoa(src).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      
      // Proxy through our API
      fetch(`/api/image-proxy?url=${encodeURIComponent(src)}&hash=${urlHash}`)
        .then(response => response.json())
        .then(data => {
          if (data.imagePath) {
            console.log('Image proxy returned:', data.imagePath);
            setImageSrc(data.imagePath);
          } else {
            throw new Error('No image path returned');
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error proxying S3 image:', err);
          setImageSrc(placeholderImage);
          setIsLoading(false);
        });
      return;
    }
    
    // Handle all other direct image URLs
    console.log('Using direct image URL:', src);
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