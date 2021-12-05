import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import './assets/styles/index.css'
import store from './store'

import longPress from '@/js/directives/longPress.js'
import ripple from '@/js/directives/ripple.js'
import autofocus from '@/js/directives/autofocus.js'
import keepScroll from '@/js/directives/keepScroll.js'

const app = createApp(App)

app.config.devtools = true
app.use(router)
app.use(store)
app.directive('keep-scroll', keepScroll)
app.directive('long-press', longPress)
app.directive('autofocus', autofocus)
app.directive('ripple', ripple)

app.mount('#app')

if (!import.meta.hot) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
  }
}
