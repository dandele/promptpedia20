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

<main class="flex items-center justify-center min-h-screen" style="background-image: url('/item_layout.svg'); 
background-size: 80% 80%;
background-position: center; 
background-repeat: no-repeat;
padding: 100px 20px;">
  <article class="rounded-lg p-6 shadow-lg relative overflow-hidden" 
           >
    <h1 class="text-4xl font-bold text-white mb-4">{item.title}</h1>
    
    {#if item.lastEdited}
      <div class="text-sm text-gray-400 mb-6">
        Updated: {new Date(item.lastEdited).toLocaleDateString()}
      </div>
    {/if}

    {#if item.description}
      <p class="text-lg mb-6 text-gray-300">{item.description}</p>
    {/if}

    <div class="text-gray-200">
      <p>{item.content}</p>
    </div>
  </article>
</main>
