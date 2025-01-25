<script>
import "../app.css";
import '@fontsource/chakra-petch';
</script>

<div class="bg-[#1d1e27] min-h-screen">
  <header class="bg-[#1d1e27] p-4 flex justify-between items-center">
    <div class="flex items-center">
      <img src="/promptpedia.webp" alt="PromptPedia" class="h-8 mr-2" />
      <span class="text-white text-xl font-bold">PromptPedia</span>
    </div>
    <div>
      <button class="bg-transparent text-white border border-white px-4 py-2 rounded mr-2">
        Made by @paradygma.tech
      </button>
      <button class="bg-white text-[#1d1e27] px-4 py-2 rounded">
        Submit your prompt
      </button>
    </div>
  </header>

  <slot></slot>

  <footer class="bg-[#1d1e27] text-gray-400 py-4">
    <div class="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
      <p>© 2025 Paradygma. All rights reserved. Made with <span class="text-blue-500">💙</span> by <a href="https://twitter.com/daniele" class="text-blue-400 hover:underline">Daniele</a></p>
      <p class="text-sm">@paradygma.tech</p>
      <p class="text-sm">Built on <a href="https://unicornplatform.com" class="text-blue-400 hover:underline">Unicorn Platform</a></p>
    </div>
  </footer>
</div>