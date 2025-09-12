<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <header class="border-b bg-white">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="font-semibold">{{ appName }}</NuxtLink>
        <nav class="flex items-center gap-4 text-sm">
          <NuxtLink to="/" class="hover:underline">Início</NuxtLink>
          <a href="https://nuxt.com" target="_blank" class="hover:underline">Documentação</a>
          <ToolsMenu />
        </nav>
      </div>
    </header>
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
  </div>

</template>

<script setup>
const appConfig = useRuntimeConfig()
const appName = appConfig.public.appName
import ToolsMenu from '../components/ToolsMenu.vue'
</script>
