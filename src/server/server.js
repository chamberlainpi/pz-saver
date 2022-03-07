import { makeRoutesFromObj, tryLoadFile } from './sv-extensions.js'
import Fastify from 'fastify'
import FastifyIO from 'fastify-socket.io'
import 'colors'
import _ from 'lodash'
import { createRoutes } from './server-routes.js'
import axios from 'axios'

globalThis.trace = console.log.bind(console)

const PORT = process.env.PORT || 3000
const clear = () => {
  process.stdout.write('\u001b[2J\u001b[0;0H')
}

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

const TEST_API = axios.create({ baseURL: 'http://localhost:3000/' })

;(async () => {
  state.config = await tryLoadFile(state.YAML_CONFIG, { pzRoot: 'not-set' })
  trace('YAML Config Successfully loaded:\n', state.config)

  //Can make `TEST_API` calls here...
})()

fastify.ready(err => {
  if (err) throw err

  clear()
  trace('Fastify server ready on port:'.magenta, PORT)
  fastify.io.on('connection', socket => setupSocketIO(fastify.io, socket))
})

function setupSocketIO(io, socket) {
  // socket.on('pz:setPZRoot', pzRoot => {
  //   trace('Setting PZ Root', pzRoot)
  // })
}

fastify.listen(PORT)
