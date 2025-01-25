import { json } from '@sveltejs/kit';
import { Client } from '@notionhq/client';
import { env } from '$env/dynamic/private';

const notion = new Client({ auth: env.NOTION_API_KEY });

// Aggiungi la funzione isFullPage
function isFullPage(item) {
  return (
    typeof item === 'object' &&
    item !== null &&
    item.object === 'page' &&
    'properties' in item
  );
}

export async function GET({ url }) {
  try {
    const databaseId = env.NOTION_DATABASE_ID;
    const itemId = url.searchParams.get('id');
    const getTags = url.searchParams.get('tags') === 'true';
    
    // Se viene richiesta la lista dei tag
    if (getTags) {
      const response = await notion.databases.retrieve({
        database_id: databaseId
      });
      
      const tagOptions = response.properties.Tag.select.options;
      return json({ tags: tagOptions });
    }
    
    // Se viene richiesto un item specifico
    if (itemId) {
      const item = await getSingleItem(itemId);
      if (!item) {
        return json({ error: 'Item not found' }, { status: 404 });
      }
      return json(item);
    }
    
    // Altrimenti restituisci la lista paginata
    const limit = Number(url.searchParams.get('limit')) || 20;
    const cursor = url.searchParams.get('cursor');
    
    const titleFilter = {
      property: "Prompt Title",
      title: {
        does_not_equal: "Titolo del prompt non trovato."
      }
    };
    
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: limit,
      start_cursor: cursor || undefined,
      filter: titleFilter
    });

    const items = response.results
      .filter(isFullPage)
      .map(mapPageToItem);

    return json({
      items,
      hasMore: response.has_more,
      nextCursor: response.next_cursor
    });

  } catch (error) {
    console.error('Error:', error);
    return json({ error: 'Internal Server Error' }, { status: 500 });
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

    const tagProperty = page.properties.Tag;
    const tag = tagProperty?.type === "select" && tagProperty.select
      ? tagProperty.select.name
      : "";

    return {
      id: page.id,
      title,
      description,
      content,
      lastEdited: page.last_edited_time,
      tag
    };
  } catch (error) {
    console.error('Error mapping page to item:', error, page);
    return null;
  }
}
