import { Client } from '@notionhq/client';
import { NotionConverter } from 'notion-to-md';
import { DefaultExporter } from 'notion-to-md/plugins/exporter';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getBlogPosts() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  
  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is required');
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