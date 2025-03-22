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

  // Local placeholder path
  const placeholderImage = '/placeholders/default.jpg';

  useEffect(() => {
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
      
      // First check if we have this placeholder in the imageMap prop
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
      }
      
      // If no mapping in props, or mapping isn't a blob URL, try the API
      const currentPostId = postId || window.location.pathname.split('/').pop();
      
      // Extract the hash from the placeholder
      const hash = src.replace('image-placeholder-', '');
      
      // First check image-map API to get the actual URL
      console.log(`Fetching image map for post ${currentPostId}`);
      fetch(`/api/image-map?postId=${currentPostId}`)
        .then(res => res.json())
        .then(imageMap => {
          console.log('Received image map:', Object.keys(imageMap).length, 'entries');
          
          // If we have a mapping for this placeholder
          if (imageMap[src]) {
            const mappedUrl = imageMap[src];
            console.log('Found mapping:', src, '->', mappedUrl.substring(0, 30) + '...');
            
            // If it's already a blob URL, use it directly
            if (mappedUrl.includes('vercel-blob.com') || mappedUrl.includes('blob.vercel-storage.com')) {
              console.log('Using blob URL directly:', mappedUrl.substring(0, 30) + '...');
              setImageSrc(mappedUrl);
              setIsLoading(false);
              return;
            } else {
              // Otherwise proxy it through our api
              console.log('Proxying through API:', mappedUrl.substring(0, 30) + '...');
              fetch(`/api/image-proxy?url=${encodeURIComponent(mappedUrl)}&hash=${hash}`)
                .then(response => response.json())
                .then(data => {
                  if (data.imagePath) {
                    console.log('Received blob URL:', data.imagePath.substring(0, 30) + '...');
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
            // No mapping found, try direct hash lookup
            console.log('No mapping found, trying direct hash lookup:', hash);
            fetch(`/api/image-proxy-check?hash=${hash}`)
              .then(response => response.json())
              .then(data => {
                if (data.imagePath) {
                  console.log('Found image via hash check:', data.imagePath.substring(0, 30) + '...');
                  setImageSrc(data.imagePath);
                } else {
                  console.log('No image found via hash, using placeholder');
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
      console.log('Detected direct AWS URL, proxying:', src.substring(0, 30) + '...');
      const urlHash = btoa(src).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
      
      fetch(`/api/image-proxy?url=${encodeURIComponent(src)}&hash=${urlHash}`)
        .then(response => response.json())
        .then(data => {
          if (data.imagePath) {
            console.log('Received blob URL for AWS image:', data.imagePath.substring(0, 30) + '...');
            setImageSrc(data.imagePath);
          } else {
            throw new Error('No image path returned');
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error proxying AWS image:', err);
          setImageSrc(placeholderImage);
          setIsLoading(false);
        });
      return;
    }
    
    // For all other cases, use the src directly
    console.log('Using src directly:', src);
    setImageSrc(src);
    setIsLoading(false);
  }, [src, postId, imageMap]);

  // Show loading state
  if (isLoading) {
    return <div className="inline-block animate-pulse bg-gray-200 dark:bg-gray-800 rounded" style={{ width, height }} />;
  }

  if (error) {
    return <div className="text-red-500 inline-block">{error}</div>;
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
      unoptimized={imageSrc.includes('amazonaws.com')}
    />
  );
}