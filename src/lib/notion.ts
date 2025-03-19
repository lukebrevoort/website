import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export async function getBlogPosts() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  
  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is required');
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Status',
      status: {
        equals: 'Published',
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
  const page = await notion.pages.retrieve({ page_id: pageId });
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const mdString = n2m.toMarkdownString(mdBlocks);
  
  return {
    page,
    markdown: mdString.parent,
  };
}