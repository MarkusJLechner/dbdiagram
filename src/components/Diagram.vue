<template>
  <div class="diagram"></div>
</template>

<script setup>
import { watch, onMounted, ref } from 'vue'
import { SVG } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import '@svgdotjs/svg.panzoom.js'

let canvas
let tableGroup

function makeSnap(e) {
  const { handler, box } = e.detail
  e.preventDefault()
  handler.move(box.x - (box.x % 25), box.y - (box.y % 25))
}

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

watch(
  () => props.modelValue,
  () => {
    console.log(props)

    console.log('mee')

    tableGroup
      .rect(100, 100)
      .radius(6)
      .attr({
        x: Math.floor(Math.random() * 25) * 25,
        y: Math.floor(Math.random() * 25) * 25,
      })
      .fill('#' + Math.random().toString(16).substr(-6))
      .on('dragmove.namespace', makeSnap)
      .draggable()
  },
  { deep: true },
)

onMounted(() => {
  window.what = props.modelValue
  canvas = SVG().addTo('.diagram').size('100%', '100%').panZoom({
    panButton: 1,
    zoomMin: 0.5,
    zoomMax: 3,
    zoomFactor: 0.2,
  })
  window.ccanvas = canvas
  console.log(canvas.bbox())
  const el = document.querySelector('.diagram')
  canvas.viewbox(0, 0, el.clientWidth, el.clientHeight)

  tableGroup = canvas.group()
  window.ttableGroup = tableGroup

  var rect = tableGroup
    .rect(100, 100)
    .radius(6)
    .fill('#f06')
    .on('dragmove.namespace', makeSnap)
    .draggable()
  tableGroup
    .rect(100, 100)
    .attr({ x: 600, y: 100 })
    .radius(6)
    .fill('#f06')
    .on('dragmove.namespace', makeSnap)
    .draggable()
  window.rrect = rect

  canvas.viewbox(tableGroup.bbox())
  canvas.zoom(1).animate().zoom(1.4)
})
</script>

<style scoped>
.diagram {
  position: relative;
  background-color: #eee;
  flex-grow: 1;
  min-width: 100px;
  min-height: 100px;
}
#chart {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>

<!--

    <svg id="chart" style="display:none;" preserveAspectRatio="xMinYMin meet">
      <g id="main-group" transform="translate(1,1) scale(1)">
        <g id="table-group">
          <g class="table-el">
            <svg
              class="table no-select"
              width="165"
              height="90"
              x="-1100"
              y="-660"
            >
              <svg class="table-header" height="32">
                <rect height="32" width="165"></rect>
                <text
                  class="table-name"
                  font-weight="bold"
                  x="13"
                  y="16"
                  dy=".35em"
                >
                  tenants
                </text>
                <title>tenants</title>
              </svg>
              <svg
                class="fas palette"
                width="16"
                height="16"
                style="fill: rgb(255, 255, 255); display: none"
                x="135"
                y="7"
              >
                <image
                  alt="palette"
                  width="16"
                  height="16"
                  x="0"
                  y="0"
                  xlink:href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICBkYXRhLXYtYTRjNDg3MDY9IiIKICBhcmlhLWhpZGRlbj0idHJ1ZSIKICBkYXRhLXByZWZpeD0iZmFzIgogIGRhdGEtaWNvbj0icGFsZXR0ZSIKICByb2xlPSJpbWciCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHZpZXdCb3g9IjAgMCA1MTIgNTEyIgogIGNsYXNzPSJoZWFkZXItaWNvbiBzdmctaW5saW5lLS1mYSBmYS1wYWxldHRlIGZhLXctMTYiPgogIDxwYXRoCiAgICBpZD0icGFsZXR0ZS1wYXRoIgogICAgZGF0YS12LWE0YzQ4NzA2PSIiCiAgICBmaWxsPSIjZmZmIgogICAgZD0iTTIwNC4zIDVDMTA0LjkgMjQuNCAyNC44IDEwNC4zIDUuMiAyMDMuNGMtMzcgMTg3IDEzMS43IDMyNi40IDI1OC44IDMwNi43IDQxLjItNi40IDYxLjQtNTQuNiA0Mi41LTkxLjctMjMuMS00NS40IDkuOS05OC40IDYwLjktOTguNGg3OS43YzM1LjggMCA2NC44LTI5LjYgNjQuOS02NS4zQzUxMS41IDk3LjEgMzY4LjEtMjYuOSAyMDQuMyA1ek05NiAzMjBjLTE3LjcgMC0zMi0xNC4zLTMyLTMyczE0LjMtMzIgMzItMzIgMzIgMTQuMyAzMiAzMi0xNC4zIDMyLTMyIDMyem0zMi0xMjhjLTE3LjcgMC0zMi0xNC4zLTMyLTMyczE0LjMtMzIgMzItMzIgMzIgMTQuMyAzMiAzMi0xNC4zIDMyLTMyIDMyem0xMjgtNjRjLTE3LjcgMC0zMi0xNC4zLTMyLTMyczE0LjMtMzIgMzItMzIgMzIgMTQuMyAzMiAzMi0xNC4zIDMyLTMyIDMyem0xMjggNjRjLTE3LjcgMC0zMi0xNC4zLTMyLTMyczE0LjMtMzIgMzItMzIgMzIgMTQuMyAzMiAzMi0xNC4zIDMyLTMyIDMyeiIKICAgIGNsYXNzPSIiPgogIDwvcGF0aD4KPC9zdmc+Cg=="
                ></image></svg
              ><svg class="field primary-key" y="32" height="29" width="165">
                <rect height="29" width="165"></rect>
                <text class="field-name" x="13" y="14.5" dy=".35em">id</text>
                <text class="field-type" y="14.5" dy=".35em" x="153">int</text>
                <title>id (int)</title></svg
              ><svg class="field" y="61" height="29" width="165">
                <rect height="29" width="165"></rect>
                <text class="field-name" x="13" y="14.5" dy=".35em">name</text>
                <text class="field-type" y="14.5" dy=".35em" x="153">
                  string
                </text>
                <title>name (string)</title>
              </svg>
            </svg>
          </g>
          <svg
            class="table no-select"
            width="165"
            height="119"
            x="-712"
            y="-688"
          >
            <svg class="table-header" height="32">
              <rect height="32" width="165"></rect>
              <text
                class="table-name"
                font-weight="bold"
                x="13"
                y="16"
                dy=".35em"
              >
                tenant_group
              </text>
              <title>tenant_group</title></svg
            ><svg
              class="fas palette"
              width="16"
              height="16"
              style="fill: rgb(255, 255, 255); display: none"
              x="135"
              y="7"
            >
              <image
                alt="palette"
                width="16"
                height="16"
                x="0"
                y="0"
                xlink:href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICBkYXRhLXYtYTRjNDg3MDY9IiIKICBhcmlhLWhpZGRlbj0idHJ1ZSIKICBkYXRhLXByZWZpeD0iZmFzIgogIGRhdGEtaWNvbj0icGFsZXR0ZSIKICByb2xlPSJpbWciCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHZpZXdCb3g9IjAgMCA1MTIgNTEyIgogIGNsYXNzPSJoZWFkZXItaWNvbiBzdmctaW5saW5lLS1mYSBmYS1wYWxldHRlIGZhLXctMTYiPgogIDxwYXRoCiAgICBpZD0icGFsZXR0ZS1wYXRoIgogICAgZGF0YS12LWE0YzQ4NzA2PSIiCiAgICBmaWxsPSIjZmZmIgogICAgZD0iTTIwNC4zIDVDMTA0LjkgMjQuNCAyNC44IDEwNC4zIDUuMiAyMDMuNGMtMzcgMTg3IDEzMS43IDMyNi40IDI1OC44IDMwNi43IDQxLjItNi40IDYxLjQtNTQuNiA0Mi41LTkxLjctMjMuMS00NS40IDkuOS05OC40IDYwLjktOTguNGg3OS43YzM1LjggMCA2NC44LTI5LjYgNjQuOS02NS4zQzUxMS41IDk3LjEgMzY4LjEtMjYuOSAyMDQuMyA1ek05NiAzMjBjLTE3LjcgMC0zMi0xNC4zLTMyLTMyczE0LjMtMzIgMzItMzIgMzIgMTQuMyAzMiAzMi0xNC4zIDMyLTMyIDMyem0zMi0xMjhjLTE3LjcgMC0zMi0xNC4zLTMyLTMyczE0LjMtMzIgMzItMzIgMzIgMTQuMyAzMiAzMi0xNC4zIDMyLTMyIDMyem0xMjgtNjRjLTE3LjcgMC0zMi0xNC4zLTMyLTMyczE0LjMtMzIgMzItMzIgMzIgMTQuMyAzMiAzMi0xNC4zIDMyLTMyIDMyem0xMjggNjRjLTE3LjcgMC0zMi0xNC4zLTMyLTMyczE0LjMtMzIgMzItMzIgMzIgMTQuMyAzMiAzMi0xNC4zIDMyLTMyIDMyeiIKICAgIGNsYXNzPSIiPgogIDwvcGF0aD4KPC9zdmc+Cg=="
              ></image></svg
            ><svg class="field primary-key" y="32" height="29" width="165">
              <rect height="29" width="165"></rect>
              <text class="field-name" x="13" y="14.5" dy=".35em">id</text>
              <text class="field-type" y="14.5" dy=".35em" x="153">int</text>
              <title>id (int)</title>
            </svg>
          </svg>
        </g>
      </g>
    </svg>


-->
