<template>
  <section>
    <h1 class="text-2xl font-semibold">Bem-vindo(a) ao {{ appName }}</h1>
    <p class="mt-2 text-gray-600">
      Edite <code>app/pages/index.vue</code> e comece a construir.
    </p>
    <div class="mt-6 flex gap-3">
      <NuxtLink to="/about" class="px-3 py-1.5 bg-black text-white rounded">Sobre</NuxtLink>
      <a
        href="https://nuxt.com/docs"
        target="_blank"
        class="px-3 py-1.5 border rounded hover:bg-gray-100"
      >Documentação do Nuxt</a>
    </div>
  </section>
</template>

<script setup>
const appName = useRuntimeConfig().public.appName
</script>
