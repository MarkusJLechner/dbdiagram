<template>
  <div>
    <TheHeader title="Index">
      <FlexSpacer />
      <ThemeSwitcher />
      <ThemeSwitcher />
      <ThemeSwitcher />
    </TheHeader>
    <div class="wrapper flex flex-grow" @mouseup="mouseup">
      <div class="resize-box" style="width: 200px">
        <CodeEditor @update="updateCode" />
      </div>
      <div class="handler" @mousedown="mousedown" @mousemove="mousemove"></div>
      <div class="resize-box" style="flex-grow: 1">
        <Diagram class="h-full" v-model="parsedCode" />
      </div>
    </div>
  </div>
</template>

<script setup>
import TheHeader from 'components/TheHeader.vue'
import FlexSpacer from 'components/FlexSpacer.vue'
import ThemeSwitcher from 'components/ThemeSwitcher.vue'

import { onMounted, ref } from 'vue'
import CodeEditor from 'components/CodeEditor.vue'
import Diagram from 'components/Diagram.vue'

const parsedCode = ref([])

let handler
let wrapper
let boxA
let isHandlerDragging
onMounted(() => {
  handler = document.querySelector('.handler')
  wrapper = handler.closest('.wrapper')
  boxA = wrapper.querySelector('.resize-box')
  isHandlerDragging = false
})

function updateCode(code) {
  console.log(code)
  parsedCode.value = code.value
}

function mousedown(e) {
  if (e.target === handler) {
    isHandlerDragging = true
  }
}
function mousemove(e) {
  if (!isHandlerDragging) {
    return false
  }
  let containerOffsetLeft = wrapper.offsetLeft
  let pointerRelativeXpos = e.clientX - containerOffsetLeft
  let boxAminWidth = 60
  boxA.style.width = Math.max(boxAminWidth, pointerRelativeXpos - 8) + 'px'
  boxA.style.flexGrow = 0
}
function mouseup(e) {
  isHandlerDragging = false
}
</script>

<style scoped>
.handler {
  width: 20px;
  padding: 0;
  cursor: ew-resize;
  flex: 0 0 auto;
}

.handler::before {
  content: '';
  display: block;
  width: 4px;
  height: 100%;
  background: #777;
  margin: 0 auto;
}

.resize-box {
  box-sizing: border-box;
  flex: 1 1 auto;
}

</style>
