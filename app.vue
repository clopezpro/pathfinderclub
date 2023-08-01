<script setup>
import '@unocss/reset/tailwind.css'
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
  margin: 0;
  padding: 0;
}
</style>
