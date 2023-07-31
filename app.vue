<script setup>
import '@unocss/reset/tailwind.css'

useHead({
  htmlAttrs: {
    lang: 'es',
  },
  charset: 'utf-8',
  title: 'Club Abisai',
  titleTemplate: title => title !== 'Club Abisai' ? `${title} · Club Abisai` : title,
  meta: [
    { name: 'description', content: 'Una aplicacion del club de conquistadores Abisai de la Iglesia Realiad de Dios de Monte Sinai en Guayaquil' },
    { property: 'og:image', content: '/cub_abisai.jpeg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@dev_clopez' },
    { name: 'twitter:creator', content: '@dev_clopez' },
  ],
  link: [
    {
      rel: 'icon', type: 'image/webp', href: '/cub_abisai.webp',
    },
  ],
})
</script>

<template>
  <NuxtLoadingIndicator />
  <div
    h-full w-full font-sans view-transition-app transition duration-0 bg-muted-100 dark:bg-gray-900
  >
    <div id="app-scroller">
      <alertModal />

      <NuxtPage />
    </div>
  </div>
</template>

<style>
html, body , #__nuxt{
  height: 100vh;
  margin: 0;
  padding: 0;
  background: #111;
  color: white;
  color-scheme: dark;
}
</style>
