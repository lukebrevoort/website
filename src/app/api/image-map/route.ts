import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Client } from '@notionhq/client';

export const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Store image maps in a secure location separate from code
const MAPS_DIR = path.join(process.cwd(), '.private');
if (!fs.existsSync(MAPS_DIR)) {
  fs.mkdirSync(MAPS_DIR, { recursive: true });
}

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get('postId');
  
  if (!postId) {
    return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
  }
  
  try {
    // Check if we have a cached map
    const mapPath = path.join(MAPS_DIR, `${postId}.json`);
    
    if (fs.existsSync(mapPath)) {
      const mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
      return NextResponse.json(mapData);
    }
    
    // If no cached map, fetch from Notion directly
    // This requires your Notion API client
    const page = await notionClient.pages.retrieve({ page_id: postId });
    const blocks = await notionClient.blocks.children.list({ block_id: postId });
    
    // Extract images from blocks
    const imageMap: Record<string, string> = {};
    // Process blocks to find images and create placeholders
    // This is a simplified example - you'll need to adapt to your Notion structure
    blocks.results.forEach(block => {
      if ('type' in block && block.type === 'image' && 'image' in block) {
        let url: string | undefined;
        if (block.image.type === 'file' && block.image.file?.url) {
          url = block.image.file.url;
        } else if (block.image.type === 'external' && block.image.external?.url) {
          url = block.image.external.url;
        }
        
        if (url) {
          const urlHash = Buffer.from(url).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
          const placeholder = `image-placeholder-${urlHash}`;
          imageMap[placeholder] = url;
        }
      }
    });
    
    // Save map for future use
    fs.writeFileSync(mapPath, JSON.stringify(imageMap));
    
    return NextResponse.json(imageMap);
  } catch (error) {
    console.error('Error generating image map:', error);
    return NextResponse.json({ error: 'Failed to generate image map' }, { status: 500 });
  }
}