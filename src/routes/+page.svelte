<script lang="ts">
  import { onMount } from 'svelte';

  export let data;
  let items = data.items || [];
  let filteredItems = items;
  let searchQuery = '';
  let isLoading = false;
  let hasMore = true;
  const batchSize = 20;
  let nextCursor;
  let totalPrompts = data.total || 0;
  let tags = [];
  let selectedTag = '';

  // Placeholder dinamico con il numero totale di item
  $: placeholderText = `Search among more than 1000 prompts...`;

  onMount(async () => {
    // Carica i tag disponibili
    const res = await fetch('/api/database?tags=true');
    if (res.ok) {
      const data = await res.json();
      tags = data.tags;
    }
  });

  // Funzione di filtro combinata (ricerca + tag)
  $: {
    filteredItems = items.filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = !selectedTag || item.tag === selectedTag;
      
      return matchesSearch && matchesTag;
    });
  }

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
        if (!totalPrompts) totalPrompts = data.total;
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      isLoading = false;
    }
  }

  async function loadItems() {
    const res = await fetch(`/api/database?tag=${selectedTag}`);
    if (res.ok) {
      const data = await res.json();
      items = data.items;
      hasMore = data.hasMore;
      nextCursor = data.nextCursor;
    }
  }

  onMount(loadMoreItems);

  let faqs = [
    {
      question: "What is an AI Prompt?",
      answer: "An AI prompt is a specific input or instruction given to an AI model to generate a response.",
      open: false
    },
    {
      question: "What Are the Best Practices for Creating Effective AI Prompts?",
      answer: "Effective AI prompts should be clear, concise, and specific to guide the AI in generating the desired output.",
      open: false
    },
    {
      question: "Why Are AI Prompts Important for Artificial Intelligence Applications?",
      answer: "AI prompts are crucial as they directly influence the quality and relevance of the AI's responses.",
      open: false
    },
    {
      question: "Can AI Prompts Be Customized for Different Industries?",
      answer: "Yes, AI prompts can be tailored to meet the specific needs and contexts of various industries.",
      open: false
    },
    {
      question: "Where Can I Find a Variety of AI Prompts?",
      answer: "You can find a variety of AI prompts in our prompt directory, which is regularly updated.",
      open: false
    }
  ];
</script>

<main>
  <section class="flex flex-col items-center justify-center text-center px-4 mt-16 mb-8
                bg-no-repeat bg-contain bg-center relative min-h-[600px]"
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
    
  <div class="w-full max-w-screen-xl mx-auto mt-8">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder={placeholderText}
      class="w-full p-4 rounded-lg bg-[#1d1e27] text-white placeholder-gray-400 border border-gray-700 hover:border-gray-400 focus:border-white focus:outline-none transition-colors"
    />
  </div>

  <div class="w-full max-w-screen-xl mx-auto mt-4 px-4">
    <nav class="flex overflow-x-auto py-2 gap-2">
      <button 
        class="px-4 py-2 rounded-full whitespace-nowrap transition-colors {selectedTag ? 'text-gray-400 hover:text-white' : 'bg-white text-black'}"
        on:click={() => {
          selectedTag = '';
          loadItems();
        }}
      >
        All
      </button>
      {#each tags as tag}
        <button 
          class="px-4 py-2 rounded-full whitespace-nowrap transition-colors {selectedTag === tag.name ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}"
          on:click={() => {
            selectedTag = tag.name;
            loadItems();
          }}
        >
          {tag.name}
        </button>
      {/each}
    </nav>
  </div>

  <section class="mx-auto w-full px-4 mb-8 mt-8 max-w-screen-xl">
    <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {#each filteredItems as item}
        <li class="border border-gray-600 transition-all duration-300 transform hover:border-white hover:scale-105 w-full max-w-md p-4 text-center rounded-md">
          <a href={`/item/${item.id}`} class="no-underline">
            <h2 class="text-white text-xl font-semibold mb-2 hover:text-gray-300 transition-colors">{item.title}</h2>
            <p class="text-gray-400">{item.description}</p>
          </a>
        </li>
      {/each}
    </ul>
    
    {#if !searchQuery}
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
    {/if}
  </section>

  <!-- Sezione Callout per la Newsletter -->
  <section class="bg-[#1d1e27] text-white py-8 mt-8">
    <div class="max-w-screen-xl mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold mb-4">Subscribe to the newsletter!</h2>
      <p class="mb-6">Get a weekly curation of the best AI prompts and practices, totally free (and automated!).</p>
      <input
        type="email"
        placeholder="Your best email"
        class="p-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 hover:border-gray-400 focus:border-white focus:outline-none transition-colors w-full max-w-md mx-auto"
      />
      <button class="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
        Subscribe!
      </button>
    </div>
  </section>

  <!-- Sezione FAQ -->
  <section class="bg-[#1d1e27] text-white py-8">
    <div class="max-w-screen-xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-4">F.A.Q.</h2>
      <p class="text-center mb-8">Get answers to your questions about our prompt directory</p>
      
      <div class="space-y-4">
        {#each faqs as faq}
          <div class="border border-gray-600 rounded-lg p-4">
            <h3 class="font-semibold cursor-pointer" on:click={() => faq.open = !faq.open}>
              {faq.question}
            </h3>
            {#if faq.open}
              <p class="mt-2 text-gray-300">{faq.answer}</p>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

</main>


