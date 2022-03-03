import { makeRoutesFromObj, tryLoadFile } from './sv-extensions.js'
import Fastify from 'fastify'
import FastifyIO from 'fastify-socket.io'
import 'colors'
import _ from 'lodash'
import { createRoutes } from './server-routes.js'
import axios from 'axios'

globalThis.trace = console.log.bind(console)

process.on('unhandledRejection', err => {
  console.log(err.toString().red)
})

const fastify = Fastify()
fastify.register(FastifyIO, { cors: { origin: '*' } }) //Options for socket.io

const state = {
  YAML_CONFIG: '.private/pzconfig.yaml',
  YAML_BASELINE: '.private/[name].baseline.yaml',
  PRIVATE_DIR: '.private',
  ZIP_SNAPSHOT: '.private/[name].snap.zip',
  config: {},
}

makeRoutesFromObj(fastify, createRoutes(state))

//////////////////////////////////
const TEST_API = axios.create({ baseURL: 'http://localhost:3000/' })

;(async () => {
  state.config = await tryLoadFile(state.YAML_CONFIG, { pzRoot: 'not-set' })
  trace('YAML Config loaded:\n', state.config)

  // const gameFolders = await axios.get('http://localhost:3000/load-game-folders')
  // trace('Loaded gameFolders:', gameFolders.data)

  const { data: statusData } = await TEST_API.get('/status')
  trace('statusData:', statusData)

  const { data: baselineData } = await TEST_API.post('/baseline-snapshot', {})
  trace('baselineData:', baselineData)

  const { data: zipBackups } = await TEST_API.get('/backups')
  trace('zipBackups:', zipBackups)

  // const { data: diffsData } = await TEST_API.get('/file-diffs-compare')
  // trace('diffsData:', diffsData)
})()

fastify.ready(err => {
  if (err) throw err

  fastify.io.on('connection', socket => setupSocketIO(fastify.io, socket))
})

function setupSocketIO(io, socket) {
  // socket.on('pz:setPZRoot', pzRoot => {
  //   trace('Setting PZ Root', pzRoot)
  // })
}

fastify.listen(3000)
