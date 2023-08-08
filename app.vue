<script setup>
useHead({
  link: [
    {
      rel: 'icon', type: 'image/webp', href: '/movies.webp',
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <AlertModal />
    <NuxtLoadingIndicator color="#348feb" :height="6" />
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* body {
  background-color: #fff;
  color: rgba(0,0,0,0.8);
}
.dark body {
 background-color: #091a28;
  color: #ebf4f1;
} */

.sepia-mode body {
  background-color: #f1e7d0;
  color: #433422;
}

html, body , #__nuxt{
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
