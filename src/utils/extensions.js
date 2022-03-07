import { ref, computed } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'

globalThis.trace = console.log.bind(console)

export const wait = duration => new Promise(_then => setTimeout(_then, duration))
export const waitUntil = getter =>
  new Promise(_then => {
    function _nextTick() {
      const result = getter()
      if (result) return _then(result)
      requestAnimationFrame(_nextTick)
    }
    _nextTick()
  })

export const axiosRef = (initVal, url) => {
  const _ref = ref(initVal)

  async function _request() {
    const { data } = await axios.get(url)
    _ref.value = data[0]
  }

  _request()

  return _ref
}

export const intervalRef = (initVal, cbReturn, duration) => {
  const _ref = ref(initVal)

  const pid = setInterval(() => (_ref.value = cbReturn()), duration)
  _ref.stop = () => clearInterval(pid)

  return _ref
}

export const useModelWrapper = (props, emit, name = 'modelValue') =>
  computed({
    get: () => props[name],
    set: v => emit(`update:${name}`, v),
  })

export const fixSlash = str => str.replace(/\\/g, '/')

export const toDuration = (ms, now) =>
  dayjs //
    .duration((now || dayjs()).diff(dayjs(ms)))
    .format('D[d] HH:mm:ss [ago]')
    .replace('0d ', '')
