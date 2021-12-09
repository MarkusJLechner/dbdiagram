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
    console.time('diff')
    const diffs = diff(oldValue, newValue)
    console.timeEnd('diff')
    Object.entries(diffs).forEach(([key, changes]) => {
      const diffEl = newValue[+key]
      if (Object.keys(changes.lines).length || changes.table) {
        console.time('create')
        createTable({ ...diffEl })
        console.timeEnd('create')
      }
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
  user-select: none;
}
</style>
<style scoped>
.diagram {
  background-color: #eee;
}
</style>
