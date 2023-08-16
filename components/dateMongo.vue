<script setup>
const props = defineProps({
  date: {
    type: String,
    default: null,
  },
})
const showDate = computed(() => {
  if (props.date) {
    const date = new Date(props.date)
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
    return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })
  }

  return ''
})
</script>

<template>
  <span>{{ showDate }}</span>
</template>
