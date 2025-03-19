import { Client } from '@notionhq/client';
import { NotionConverter } from 'notion-to-md';
import { StringExporter } from 'notion-to-md/plugins/exporter';

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
  
  // Create a string exporter to get markdown as a string
  const stringExporter = new StringExporter();
  
  // Initialize the converter with the string exporter
  const n2m = new NotionConverter(notion)
    .withExporter(stringExporter);
    
  // Convert the page to markdown
  await n2m.convert(pageId);
  
  // Get the markdown content
  const markdown = stringExporter.getMarkdown();
  
  return {
    page,
    markdown,
  };
}