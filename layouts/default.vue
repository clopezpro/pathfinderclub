<template>
  <div h-screen w-screen>
    <!-- class="  lg:rows-[1fr,max-content] lg:cols-[max-content,1fr]" -->

    <div

      class="grid   grid-cols-[max-content,1fr] grid-rows-[1fr,max-content] gap-x-1 "
      h-full w-full font-sans
      bg-muted-100 dark:bg-gray-900
      of-hidden view-transition-app transition duration-0
    >
      <NavBar />
      <div of-x-hidden of-y-auto relative data-scroll>
        <slot />
      </div>
    </div>
  </div>
</template>
<!--
<style>
html, body , #__nuxt{
  height: 100vh;
  margin: 0;
  padding: 0;
  background: rgb(17 24 39/1);
  color: white;
  color-scheme: dark;
}
</style>
 -->
