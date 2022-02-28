import { readdir } from '../utils/sv-extensions'
import Fastify from 'fastify'
import FastifyIO from 'fastify-socket.io'
import 'colors'
import yaml from 'yaml'
import fs from 'fs-extra'
import path from 'path'

globalThis.trace = console.log.bind(console)

const fastify = Fastify()

fastify.register(FastifyIO, { cors: { origin: '*' } }) //Options for socket.io

fastify.get('/', (req, res) => {
  return 'Hello World'
})

//////////////////////////////////

async function tryLoadFile(uri, fallbackData) {
  uri = path.resolve(uri)
  const dir = path.dirname(uri)

  if (!fs.existsSync(dir)) {
    await fs.mkdirp(dir)
    return fallbackData
  }

  if (!fs.existsSync(uri)) {
    return fallbackData
  }

  const data = await fs.readFile(uri, 'utf8')

  return yaml.parse(data)
}

const YAML_CONFIG = '.private/pzconfig.yaml'

const state = { count: 100, config: {} }
;(async () => {
  state.config = await tryLoadFile(YAML_CONFIG)
})()

fastify.get('/count', (req, res) => {
  return [state.count]
})

fastify.get('/config', (req, res) => {
  return [state.config]
})

fastify.post('/config', async (req, res) => {
  state.config = req.body
  const yamlStr = yaml.stringify(state.config)
  await fs.writeFile(YAML_CONFIG, yamlStr, 'utf8')
  return { isOK: true, config: state.config, yaml: yamlStr }
})

fastify.get('/load-game-folders', async (req, res) => {
  const { pzRoot } = state.config
  const pzSaves = pzRoot.includes('/Saves') ? pzRoot : `${pzRoot}/Saves`
  const allGameSaves = await readdir(pzSaves, { depth: 2 })

  // trace(allGameSaves)
  // return allGameSaves
})

fastify.ready(err => {
  if (err) throw err

  fastify.io.on('connection', socket => setupSocketIO(fastify.io, socket))
})

function setupSocketIO(io, socket) {
  const updateCount = offset => {
    trace('UPDATE COUNT...', offset)
    state.count += offset
    io.emit('count-update', state.count)
  }

  socket.on('increase', () => updateCount(1))
  socket.on('decrease', () => updateCount(-1))

  socket.on('pz:setPZRoot', pzRoot => {
    trace('Setting PZ Root', pzRoot)
  })
}

fastify.listen(3000)
