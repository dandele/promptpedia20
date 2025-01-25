import { json } from '@sveltejs/kit';
import { Client } from '@notionhq/client';
import { env } from '$env/dynamic/private';

const notion = new Client({ auth: env.NOTION_API_KEY });

export async function GET({ url }) {
  try {
    const databaseId = env.NOTION_DATABASE_ID;
    const id = url.searchParams.get('id');

    if (!databaseId) throw new Error('NOTION_DATABASE_ID is not defined');

    if (id) {
      const item = await getSingleItem(id);
      if (!item) {
        return json(null, { status: 404 });
      }
      return json(item);
    }

    const offset = parseInt(url.searchParams.get('offset') || '0');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "Prompt Title",
            title: {
              is_not_empty: true
            }
          },
          {
            property: "Prompt Title",
            title: {
              does_not_equal: "Titolo del prompt non trovato."
            }
          }
        ]
      },
      start_cursor: url.searchParams.get('cursor') || undefined,
      page_size: limit
    });

    const items = response.results.map((item) => {
      const titleProperty = item.properties["Prompt Title"];
      const title = titleProperty?.type === "title" && titleProperty.title.length > 0
        ? titleProperty.title[0].text.content
        : "Untitled";

      const descriptionProperty = item.properties.Excerpt;
      const description = descriptionProperty?.type === "rich_text" && descriptionProperty.rich_text.length > 0
        ? descriptionProperty.rich_text[0].text.content
        : "";

      return {
        id: item.id,
        title,
        description,
        lastEdited: item.last_edited_time
      };
    });

    return json({
      items,
      hasMore: response.has_more,
      nextCursor: response.next_cursor
    });
  } catch (error) {
    console.error('Error:', error);
    return json([], { status: 500 });
  }
}

async function getSingleItem(id) {
  try {
    const databaseId = env.NOTION_DATABASE_ID;
    
    // Rimuovi i trattini dall'ID per il confronto
    const normalizedId = id.replace(/-/g, '');
    
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "ID",
        formula: {
          string: {
            equals: normalizedId
          }
        }
      },
      page_size: 1
    });

    if (response.results.length === 0) {
      // Se non trova risultati, prova a cercare per page_id
      try {
        const page = await notion.pages.retrieve({ page_id: id });
        return mapPageToItem(page);
      } catch (error) {
        console.error('Error retrieving page by ID:', error);
        return null;
      }
    }

    return mapPageToItem(response.results[0]);
  } catch (error) {
    console.error('Error in getSingleItem:', error);
    return null;
  }
}

function mapPageToItem(page) {
  if (!page || !page.properties) {
    console.error('Invalid page object:', page);
    return null;
  }

  try {
    const titleProperty = page.properties["Prompt Title"];
    const title = titleProperty?.type === "title" && titleProperty.title.length > 0
      ? titleProperty.title[0].text.content
      : "Untitled";

    const descriptionProperty = page.properties.Excerpt;
    const description = descriptionProperty?.type === "rich_text" && descriptionProperty.rich_text.length > 0
      ? descriptionProperty.rich_text[0].text.content
      : "";

    const contentProperty = page.properties.Content;
    const content = contentProperty?.type === "rich_text" && contentProperty.rich_text.length > 0
      ? contentProperty.rich_text.map(t => t.text.content).join("")
      : "";

    return {
      id: page.id,
      title,
      description,
      content,
      lastEdited: page.last_edited_time
    };
  } catch (error) {
    console.error('Error mapping page to item:', error, page);
    return null;
  }
}
