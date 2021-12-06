<template>
  <div>
    <TheHeader title="Index">
      <FlexSpacer />
      <ThemeSwitcher />
      <ThemeSwitcher />
      <ThemeSwitcher />
    </TheHeader>
    <div ref="box" class="box wrapper flex flex-grow">
      <div class="left">
        <CodeEditor @update="updateCode" />
      </div>
      <div class="resize"></div>
      <div class="right">
        <Diagram v-model="parsedCode" class="h-full" />
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

onMounted(() => {
  dragControllerDiv()
})

function updateCode(code) {
  parsedCode.value = code
}

function dragControllerDiv() {
  const resize = document.getElementsByClassName('resize')
  const left = document.getElementsByClassName('left')
  const mid = document.getElementsByClassName('right')
  const box = document.getElementsByClassName('box')
  if (!(resize && left && mid && box)) {
    return
  }
  for (let i = 0; i < resize.length; i++) {
    resize[i].onmousedown = function (e) {
      const startX = e.clientX
      document.onmousemove = function (e) {
        resize[i].left = startX
        const endX = e.clientX
        let moveLen = resize[i].left + (endX - startX)
        const maxT = box[i].clientWidth - resize[i].offsetWidth
        if (moveLen < 32) {
          moveLen = 32
        }
        if (moveLen > maxT - 150) {
          moveLen = maxT - 150
        }
        resize[i].style.left = moveLen
        for (let j = 0; j < left.length; j++) {
          left[j].style.width =
            (moveLen / document.body.clientWidth) * 100 + '%'
          mid[j].style.width =
            ((box[i].clientWidth - moveLen) / document.body.clientWidth -
              0.008) *
              100 +
            '%'
        }
      }
      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
        resize[i].releaseCapture && resize[i].releaseCapture()
      }
      resize[i].setCapture && resize[i].setCapture()
      return false
    }
  }
}
</script>

<style scoped>
.left {
  height: 100%;
  width: 20%;
  min-width: 150px;
  overflow-y: auto;
  overflow-x: hidden;
  float: left;
}

.resize {
  cursor: col-resize;
  float: left;
  position: relative;
  background-color: #333;
  border-radius: 5px;
  width: 12px;
  height: 100%;
  line-height: 100%;
  text-align: center;
  background-size: cover;
  background-position: center;
  font-size: 1rem;
  color: #777;
  z-index: 2;
}

.resize::before {
  content: '⋮';
  position: absolute;
  top: 45%;
  left: 3px;
}

.resize:hover {
  background-color: #444;
  color: #fff;
}

.right {
  width: 80%;
  float: left;
  height: 100%;
}

.box {
  width: 100%;
  height: 7.8rem;
}
</style>
