<template>
  <div class="editor h-full">
    <v-ace-editor
      v-model:value="content"
      lang="sql"
      theme="monokai"
      style="height: 100%; width: 100%"
      @init="editorInit"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { VAceEditor } from 'vue3-ace-editor'
import { version } from 'ace-builds'

ace.config.set(
  'basePath',
  'https://cdn.jsdelivr.net/npm/ace-builds/src-noconflict/',
)

const content = ref(`EnUM ENUM_AUTHS {
  JWT
  PASSWORD_SHA256
  WEB_AUTHN
}

TABLE tenants
{
  id int [pk]
  name string

  Note: 'Bsp:
  A: tenants: hellocash_admin, helloshop, buha
  B: tenants: hc1, hc2, hc3, hc4
  '
}`)

const parsedCode = ref([])
const emit = defineEmits(['update'])

const options = {
  tabSize: 2,
  enableBasicAutocompletion: !0,
  enableLiveAutocompletion: !0,
  hScrollBarAlwaysVisible: !1,
  vScrollBarAlwaysVisible: !1,
  fontSize: 14,
  showPrintMargin: !1,
}

const editorInit = (editor) => {
  editor.setOptions(options)
}

watch(content, () => {
  doParseCode()
})

onMounted(() => {
  doParseCode()
})

function doParseCode() {
  const regexColumns =
    /(?<type>Table|enum) *(?<table>\w+)\s*\{\s*(?<content>[^\}]+\})/gi
  const regexLines = /^ *(Note: '[\w\W]*?'|.+$)/gim

  const columns = [...content.value.matchAll(regexColumns)].map((g) => g.groups)

  const parsed = columns.map((m) => {
    return {
      ...m,
      lines: [...m.content.matchAll(regexLines)].map((g) => g[1].trim()),
    }
  })

  if (JSON.stringify(parsed) !== JSON.stringify(parsedCode.value)) {
    parsedCode.value = parsed
  }
}

watch(parsedCode, () => {
  emit('update', parsedCode.value)
})
</script>

<style scoped>
.editor {
  color: #fff;
  background-color: #282828;
}
</style>
