<script lang="ts">
  import { onMount } from 'svelte';

  export let data;
  let items = data.items || [];
  let isLoading = false;
  let hasMore = true;
  const batchSize = 20;
  let nextCursor;

  async function loadMoreItems() {
    if (isLoading || !hasMore) return;
    
    isLoading = true;
    try {
      const res = await fetch(`/api/database?limit=${batchSize}&cursor=${nextCursor || ''}`);
      if (res.ok) {
        const data = await res.json();
        items = [...items, ...data.items];
        hasMore = data.hasMore;
        nextCursor = data.nextCursor;
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      isLoading = false;
    }
  }

  onMount(loadMoreItems);
</script>

<main>
  <section class="flex flex-col items-center justify-center text-center px-4 mt-16 mb-8
                bg-no-repeat bg-contain bg-center relative min-h-[400px]"
          style="background-image: url('/hero.webp');">
    <div class="relative z-10">
      <h1 class="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 leading-tight">
        All the AI Prompts you can ask for
      </h1>
      <p class="text-base sm:text-lg mb-1">
        Promptpedia is the greatest community-based library of AI Prompts.
      </p>
      <p class="text-base sm:text-lg mb-6">
        Learn from the best AI prompts and become a true AI master!
      </p>
    </div>
  </section>

  <section class="mx-auto w-full px-4 mb-6 max-w-screen-xl">
    <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {#each items as item}
        <li class="card preset-outlined border-[1px] w-full max-w-md p-4 text-center border border-surface-700 rounded-md">
          <a href={`/item/${item.id}`} class="no-underline">
            <h2 class="text-white text-xl font-semibold mb-2 hover:text-gray-300 transition-colors">{item.title}</h2>
            <p class="text-gray-400">{item.description}</p>
          </a>
        </li>
      {/each}
    </ul>
    
    <div class="text-center mt-6">
      {#if hasMore}
        <button 
          type="button" 
          class="btn preset-filled"
          on:click={loadMoreItems}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load More Prompts'}
        </button>
      {:else}
        <p class="text-gray-400">No more prompts to load</p>
      {/if}
    </div>
  </section>
</main>


