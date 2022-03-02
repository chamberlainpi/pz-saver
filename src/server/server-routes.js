import fs from 'fs-extra'
import _ from 'lodash'
import yaml from 'yaml'
import { readdir } from './sv-extensions'

async function saveConfig(state) {
  const yamlStr = yaml.stringify(state.config)

  trace('YAML config', state.config)

  await fs.writeFile(state.YAML_CONFIG, yamlStr, 'utf8')
  return { isOK: true, config: state.config, yaml: yamlStr }
}

export const createRoutes = state => ({
  'GET::/': (req, res) => 'Hello World',
  'GET::/count': (req, res) => [state.count],
  'GET::/config': (req, res) => [state.config],

  'POST::/config': async (req, res) => {
    state.config = req.body

    return await saveConfig(state)
  },

  'GET::/load-game-folders': async (req, res) => {
    const { pzRoot } = state.config
    const pzSaves = pzRoot.includes('/Saves') ? pzRoot : `${pzRoot}/Saves`

    const allGameSaves = await readdir(pzSaves, { depth: 2 })

    const filteredGameSaves = allGameSaves //
      .filter(p => p.isDir && p.depth === 1)
      .map(p => {
        const { atimeMs, mtimeMs, ctimeMs, birthtimeMs } = fs.statSync(p.path)
        return { ..._.omit(p, 'isDir'), stat: { atimeMs, mtimeMs, ctimeMs, birthtimeMs } }
      })

    return filteredGameSaves
  },
})
