<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <header class="border-b bg-white">
      <div class="mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <NuxtLink to="/" class="font-semibold">{{ appName }}</NuxtLink>
        <nav class="flex items-center gap-4 text-sm">

          <ToolsMenu />
        </nav>
      </div>
    </header>
    <main class="mx-auto px-4 py-8 max-w-[1440px]">
      <slot />
    </main>
    <ToastHost />
  </div>

</template>

<script setup>
const appConfig = useRuntimeConfig()
const appName = appConfig.public.appName
import ToolsMenu from '../components/ToolsMenu.vue'
import ToastHost from '../components/ToastHost.vue'
</script>
