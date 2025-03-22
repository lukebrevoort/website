import { Client } from '@notionhq/client';
import { NotionConverter } from 'notion-to-md';
import { DefaultExporter } from 'notion-to-md/plugins/exporter';
import dotenv from 'dotenv';

// Initialize environment variables - this is more robust for different environments
// Load from .env file locally, but also respect existing env vars in CI environments
dotenv.config();

// Get the Notion token from environment variables
const notionToken = process.env.NOTION_TOKEN;
if (!notionToken) {
  console.error('❌ NOTION_TOKEN is not set in environment variables');
  // Don't throw here, wait until the function is called
}

const notion = new Client({
  auth: notionToken,
});

export async function getBlogPosts() {
  // Get the database ID from environment variables
  const databaseId = process.env.NOTION_DATABASE_ID;
  
  // More detailed error for debugging
  if (!databaseId) {
    console.error('❌ NOTION_DATABASE_ID is not set in environment variables');
    console.error('Available environment variables:', Object.keys(process.env).filter(key => !key.includes('SECRET')));
    throw new Error('NOTION_DATABASE_ID is required - please check GitHub secrets');
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Published',
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  });

  return response.results;
}

// Rest of your code remains unchanged

export async function getBlogPost(pageId: string) {
  // First, retrieve the page data
  const page = await notion.pages.retrieve({ page_id: pageId });
  
  const buffer: { [key: string]: string } = {};

  const exporter = new DefaultExporter({
      outputType: 'buffer',
      buffer: buffer
  });
  
  // Initialize the converter with the string exporter
  const n2m = new NotionConverter(notion)
    .withExporter(exporter);
    
  // Convert the page to markdown
  await n2m.convert(pageId);
  
  // Get the markdown content
  const markdown = buffer[pageId] || '';
  
  return {
    page,
    markdown,
  };
}