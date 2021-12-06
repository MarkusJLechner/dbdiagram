<template>
  <div class="diagram"></div>
</template>

<script setup>
import { clear, createTable, init } from "@/components/Diagram.js"
import { watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    clear()
    newValue.forEach((table) => {
      createTable({ ...table })
    })
  },
)

onMounted(() => {
  init({ element: '.diagram' })
})
</script>

<style>
svg text {
  pointer-events: none;
}
</style>
<style scoped>
.diagram {
  background-color: #eee;
}
</style>
