import { Client } from '@notionhq/client';
import { env } from '$env/dynamic/private';
import type { PageObjectResponse } from '@notionhq/client';

// Inizializza il client di Notion
const notion = new Client({
  auth: env.NOTION_API_KEY,
});

// Type guard per verificare se un oggetto è un PageObjectResponse
function isFullPage(item: unknown): item is PageObjectResponse {
  return (
    typeof item === 'object' &&
    item !== null &&
    (item as PageObjectResponse).object === 'page' &&
    'properties' in item
  );
}

// Funzione per ottenere i contenuti del database
export async function getDatabaseContents() {
  const databaseId = env.NOTION_DATABASE_ID;

  if (!databaseId) {
    throw new Error('NOTION_DATABASE_ID is not defined in the environment variables.');
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    return response.results
      .filter(isFullPage)
      .map((item) => {
        const titleProperty = item.properties["Prompt Title"];
        const title =
          titleProperty?.type === "title" && titleProperty.title.length > 0
            ? titleProperty.title[0].text.content
            : "Untitled";

        const descriptionProperty = item.properties.Excerpt;
        const description =
          descriptionProperty?.type === "rich_text" && descriptionProperty.rich_text.length > 0
            ? descriptionProperty.rich_text[0].text.content
            : "";

        return {
          id: item.id,
          title,
          description
        };
      });
  } catch (error) {
    console.error('Error fetching database:', error);
    return [];
  }
}
