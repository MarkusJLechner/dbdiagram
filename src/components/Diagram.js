import { SVG } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import '@svgdotjs/svg.panzoom.js'

let canvas
let tableGroup
let lineGroup

let tableMemory = {}
window.tableMemory = tableMemory

function diff(obj1, obj2) {
  const result = {}
  if (Object.is(obj1, obj2)) {
    return undefined
  }
  if (!obj2 || typeof obj2 !== 'object') {
    return obj2
  }
  Object.keys(obj1 || {})
    .concat(Object.keys(obj2 || {}))
    .forEach((key) => {
      if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
        result[key] = obj2[key]
      }
      if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
        const value = diff(obj1[key], obj2[key])
        if (value !== undefined) {
          result[key] = value
        }
      }
    })
  return result
}

window.diff = diff

export function init({ element = '.diagram' } = {}) {
  canvas = SVG().addTo(element).size('100%', '100%').panZoom({
    panButton: 1,
    zoomMin: 0.5,
    zoomMax: 3,
    zoomFactor: 0.2,
  })

  const el = document.querySelector(element)
  canvas.viewbox(0, 0, el.clientWidth, el.clientHeight)

  tableGroup = canvas.group({ name: 'tables' })
  lineGroup = canvas.group({ name: 'lines' })

  setTimeout(() => {
    doBoundingBoxZoom()
  }, 30)
}

function doBoundingBoxZoom() {
  canvas.viewbox(tableGroup.bbox())
  canvas.zoom(1).animate().zoom(1.4)
}

function modifierDragSnap(e) {
  const { handler, box } = e.detail
  e.preventDefault()
  const x = box.x - (box.x % 10)
  const y = box.y - (box.y % 10)
  handler.move(x, y)
}

function getTableChildren() {
  return tableGroup && tableGroup.children().length
}

export function clear() {
  canvas.clear()
  tableGroup = canvas.group({ name: 'tables' })
  lineGroup = canvas.group({ name: 'lines' })
}

function initTableMemory(id) {
  if (!tableMemory[id]) {
    tableMemory[id] = {
      position: { x: 0, y: 0 },
    }
  }
}

function setTablePosition({ id, x, y }) {
  initTableMemory(id)

  tableMemory[id].position.x = x
  tableMemory[id].position.y = y
}

export const createTable = ({
  x = 0,
  y = 0,
  id,
  table: tableName = 'No title',
  lines,
}) => {
  if (tableMemory[id]) {
    tableMemory[id].table.remove()
    x = tableMemory[id].position.x
    y = tableMemory[id].position.y
  } else {
    x = Math.floor(Math.random() * 10) * 20
    y = Math.floor(Math.random() * 10) * 20
    setTablePosition({ id, x, y })
  }

  const headerHeight = 20
  const entryHeight = 20

  const totalHeight = lines.length * entryHeight + headerHeight

  const table = SVG()
    .attr({ x: x, y: y, id })
    .size(50, totalHeight)
    .on('dragmove.namespace', modifierDragSnap)
    .draggable()
    .on('beforedrag', (e) => {
      const el = e.detail.event.target
      if (el.dataset.name !== 'header') {
        e.preventDefault()
      }
    })
    .on('dragend', (e) => {
      const { handler } = e.detail
      tableMemory[handler.el.attr('id')].position = {
        x: handler.el.attr('x'),
        y: handler.el.attr('y'),
      }
    })

  const minWidth = 150

  const headerGroup = table.nested()
  const bodyGroup = table.nested()

  const headerBackground = headerGroup
    .path(roundedRect(0, 0, table.width(), headerHeight, 6, 6, 6, 0, 0))
    .data('name', 'header')
    .attr({ x: 0, y: 0 })
    .fill('#184ea3')

  const headerText = headerGroup
    .plain(tableName)
    .move(4, -2)
    .font({ fill: '#fff', anchor: 'center', size: 12, family: 'Verdana' })

  const newWidth = Math.max(headerText.bbox().x2 + 12, minWidth)

  let textMaxWidth = minWidth
  let linesBackground = []
  const rowColorLight = '#ccc'
  const rowColorDark = '#eee'

  let initMousedown = null
  lines.forEach((line, index) => {
    let bodyBackground = bodyGroup
      .rect(newWidth, entryHeight)
      .attr({ x: 0, y: headerHeight + entryHeight * index })
      .fill(index % 2 ? rowColorLight : rowColorDark)

    linesBackground.push(bodyBackground)

    bodyBackground.on('mousedown', function (event) {
      console.log(event.target)
      initMousedown = event.target
    })
    bodyBackground.on('mouseup', function (event) {
      console.log(event.target)
      if (initMousedown) {
        initMousedown = null
      }
    })

    const text = bodyGroup
      .plain(line)
      .move(6, headerHeight + entryHeight * index - 3)
      .font({ fill: '#000', anchor: 'center', size: 12, family: 'Verdana' })

    const textWidth = Math.max(text.bbox().x2 + 12, minWidth)
    textMaxWidth = Math.max(textWidth, minWidth)
  })

  const calcWidth = Math.max(newWidth, textMaxWidth)

  linesBackground.forEach((bg) => {
    bg.width(calcWidth)
  })

  table.width(calcWidth)
  headerBackground.attr({
    d: roundedRect(0, 0, calcWidth, 20, 6, 6, 6, 0, 0),
  })

  tableGroup.add(table)

  tableMemory[id].table = table

  return table
}

function roundedRect(x, y, w, h, r, tl, tr, bl, br) {
  let retval
  retval = `M${x + r},${y}`
  retval += `h${w - 2 * r}`
  if (tr) {
    retval += `a${r},${r} 0 0 1 ${r},${r}`
  } else {
    retval += `h${r}`
    retval += `v${r}`
  }
  retval += `v${h - 2 * r}`
  if (br) {
    retval += `a${r},${r} 0 0 1 ${-r},${r}`
  } else {
    retval += `v${r}`
    retval += `h${-r}`
  }
  retval += `h${2 * r - w}`
  if (bl) {
    retval += `a${r},${r} 0 0 1 ${-r},${-r}`
  } else {
    retval += `h${-r}`
    retval += `v${-r}`
  }
  retval += `v${2 * r - h}`
  if (tl) {
    retval += `a${r},${r} 0 0 1 ${r},${-r}`
  } else {
    retval += `v${-r}`
    retval += `h${r}`
  }
  retval += 'z'
  return retval
}
