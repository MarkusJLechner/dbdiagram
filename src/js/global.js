import { refstorage } from '@/store/globalstate.js'
import { defaultSettings } from './defaultSettings.js'

export const vibrate = (pattern = 30) => {
  if (refstorage.getSetting(defaultSettings.general.vibrate)) {
    navigator.vibrate(pattern)
  }
}

export const persist = () => {
  return navigator.storage.persist().then(function (persistent) {
    if (persistent) {
      console.log('Storage will not be cleared except by explicit user action')
    } else {
      console.log('Storage may be cleared by the UA under storage pressure.')
    }
  })
}

export const isMobile =
  'ontouchstart' in document.documentElement &&
  /mobi/i.test(navigator.userAgent)

export const sleep = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout))

export function createTimer({
  duration = 60,
  callback = () => {},
  runOnStart = true,
}) {
  let timer = 0
  let paused = !runOnStart
  let minutes, seconds
  let interval = null
  const set = (duration) => {
    interval = setInterval(function () {
      if (!paused) {
        minutes = parseInt('' + timer / 60, 10)
        seconds = parseInt('' + (timer % 60), 10)

        minutes = minutes < 10 ? '0' + minutes : minutes
        seconds = seconds < 10 ? '0' + seconds : seconds

        callback(timer, minutes + ':' + seconds)

        if (timer++ >= duration) {
          clearInterval(interval)
          interval = null
        }
      }
    }, 1000)
  }

  if (runOnStart) {
    set(duration)
  }

  const start = () => {
    if (interval === null) {
      set(duration)
    }
    paused = false
  }
  const pause = () => (paused = true)
  const reset = () => {
    timer = 0
    callback(0, '00:00')
    start()
  }

  return {
    start,
    pause,
    set,
    reset,
  }
}

export const resolveObjectPath = (object, path, defaultValue) => {
  return path.split('.').reduce((o, p) => (o ? o[p] : defaultValue), object)
}
