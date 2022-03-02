import { ref } from 'vue'
import axios from 'axios'

globalThis.trace = console.log.bind(console)

export const wait = duration => new Promise(_then => setTimeout(_then, duration))

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

export const fixSlash = str => str.replace(/\\/g, '/')
