<script lang="ts">
/* import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const res = await fetch('/api/database'); // Richiama tutti gli item dall'endpoint
  if (!res.ok) {
    throw new Error('Failed to fetch items');
  }

  const items = await res.json();
  const item = items.find((i: { id: string }) => i.id === params.id); // Cerca l'elemento corrispondente

  if (!item) {
    throw new Error(`Item with ID ${params.id} not found`);
  }

  return { item };
};
*/
export let data: { 
  item: { 
    title: string;
    description: string;
    content: string;
    lastEdited: string;
  }
};
const { item } = data;
</script>

<main class="max-w-4xl mx-auto px-4 py-8">
  <article class="preset-outlined border-surface-700 rounded-lg p-6">
    <h1 class="text-4xl font-bold mb-4">{item.title}</h1>
    
    {#if item.lastEdited}
      <div class="text-sm text-gray-400 mb-6">
        Updated: {new Date(item.lastEdited).toLocaleDateString()}
      </div>
    {/if}

    {#if item.description}
      <p class="text-lg mb-6 text-gray-300">{item.description}</p>
    {/if}

    {#if item.content}
      <div class="prose prose-invert max-w-none">
        {@html item.content.replace(/\n/g, '<br>')}
      </div>
    {/if}
  </article>
</main>
