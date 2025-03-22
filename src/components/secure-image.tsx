"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SecureImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  postId?: string;
}

export default function SecureImage({ src, alt, width = 800, height = 600, className, postId }: SecureImageProps) {
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
      setImageSrc(src);
      setIsLoading(false);
      return;
    }
    
    // Handle image placeholders
    if (src.startsWith('image-placeholder-')) {
      // First check if we have the mapping
      const currentPostId = postId || window.location.pathname.split('/').pop();
      
      fetch(`/api/image-map?postId=${currentPostId}`)
        .then(res => res.json())
        .then(imageMap => {
          // Check if we have a direct mapping
          if (imageMap[src]) {
            const mappedUrl = imageMap[src];
            
            // If it's already a blob URL, use it directly
            if (mappedUrl.includes('vercel-blob.com') || mappedUrl.includes('blob.vercel-storage.com') || mappedUrl.startsWith('/')) {
              setImageSrc(mappedUrl);
              setIsLoading(false);
            } else {
              // Otherwise proxy it through our api
              const urlHash = btoa(mappedUrl).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
              fetch(`/api/image-proxy?url=${encodeURIComponent(mappedUrl)}&hash=${urlHash}`)
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
                  console.error('Image proxy error:', err);
                  setImageSrc(placeholderImage);
                  setIsLoading(false);
                });
            }
          } else {
            // If no mapping found, try direct hash lookup
            const hash = src.replace('image-placeholder-', '');
            fetch(`/api/image-proxy-check?hash=${hash}`)
              .then(response => response.json())
              .then(data => {
                if (data.imagePath) {
                  setImageSrc(data.imagePath);
                } else {
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
    
    // Final safeguard - If we somehow get an AWS URL directly, proxy it
    if (src.includes('amazonaws.com') || src.includes('prod-files-secure.s3')) {
      const urlHash = btoa(src).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
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
          setImageSrc(placeholderImage);
          setIsLoading(false);
        });
      return;
    }
    
    // For all other cases, use the src directly
    setImageSrc(src);
    setIsLoading(false);
  }, [src, postId]);

  // Show loading state
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