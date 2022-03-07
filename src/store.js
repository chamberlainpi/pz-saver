import axios from 'axios'
import { ref } from 'vue'
import { axiosRef } from './utils/extensions'

export const configuration = axiosRef({ pzRoot: '' }, '/api/config')

export async function saveConfig() {
  const { data } = await axios.post('/api/config', configuration.value)
  trace(data)
}

export async function setConfig() {
  configuration.value.pzRoot = fixSlash(configuration.value.pzRoot)
  await saveConfig()
}

export const status = ref({ isBaselineSnapped: false, isCurrentSnapped: false })

export async function checkStatuses() {
  let { data } = await axios.get('/api/status')
  status.value = data

  setTimeout(checkStatuses, 3000)
}