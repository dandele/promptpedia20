<script>
import "../app.css";
import '@fontsource/chakra-petch';

let isMenuOpen = false; // Stato per gestire l'apertura del menu
</script>

<div class="bg-[#1d1e27] min-h-screen">
  <header class="bg-[#1d1e27] p-4 flex flex md:flex-row justify-between items-center">
    <div class="flex items-center">
      <img src="/promptpedia.webp" alt="PromptPedia" class="h-8 mr-2" />
      <span class="text-white text-xl font-bold">PromptPedia</span>
    </div>
    <div class="flex items-center mt-2 md:mt-0">
      <button class="bg-white text-black border border-white px-4 py-2 rounded mr-2 md:hidden" on:click={() => isMenuOpen = !isMenuOpen}>
        {#if isMenuOpen}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="black">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="black">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        {/if}
      </button>
      <div class="hidden md:flex space-x-4">
        <button class="bg-transparent text-white border border-white px-4 py-2 rounded">
          Made by @paradygma.tech
        </button>
        <button class="bg-white text-[#1d1e27] px-4 py-2 rounded">
          Submit your prompt
        </button>
      </div>
    </div>
  </header>

  {#if isMenuOpen}
    <div class="fixed inset-0 bg-gray-800 flex flex-col items-center justify-start z-50">
      <div class="flex justify-between w-full px-4 pt-4">
        <div class="flex items-center">
          <img src="/promptpedia.webp" alt="PromptPedia" class="h-8 mr-2" />
          <span class="text-white text-xl font-bold">PromptPedia</span>
        </div>
        <button class="bg-white text-black" on:click={() => isMenuOpen = false}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="black">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="flex flex-col items-center justify-start flex-grow pt-4">
        <button class="bg-transparent text-white border border-white px-4 py-2 rounded mb-2">
          Made by @paradygma.tech
        </button>
        <button class="bg-white text-[#1d1e27] px-4 py-2 rounded">
          Submit your prompt
        </button>
      </div>
    </div>
  {/if}

  <slot></slot>

  <footer class="bg-[#1d1e27] text-gray-400 py-4">
    <div class="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
      <p>© 2025 Paradygma. All rights reserved.</p>
      <p class="text-sm">Made with <span class="text-blue-500">💙</span> by <a href="https://twitter.com/daniele" class="text-blue-400 hover:underline">Daniele</a> @paradygma.tech</p>
    </div>
  </footer>
</div>

<style>
  /* Aggiungi eventuali stili personalizzati qui */
</style>