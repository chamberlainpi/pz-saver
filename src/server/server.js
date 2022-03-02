import { makeRoutesFromObj, tryLoadFile } from './sv-extensions'
import Fastify from 'fastify'
import FastifyIO from 'fastify-socket.io'
import 'colors'
import _ from 'lodash'
import { createRoutes } from './server-routes'
import axios from 'axios'

globalThis.trace = console.log.bind(console)

const fastify = Fastify()
fastify.register(FastifyIO, { cors: { origin: '*' } }) //Options for socket.io

const state = {
  YAML_CONFIG: '.private/pzconfig.yaml',
  config: {},
}

makeRoutesFromObj(fastify, createRoutes(state))

//////////////////////////////////
;(async () => {
  state.config = await tryLoadFile(state.YAML_CONFIG, { pzRoot: 'not-set' })
  trace('YAML Config loaded:\n', state.config)

  const gameFolders = await axios.get('http://localhost:3000/load-game-folders')
  trace('Loaded gameFolders:', gameFolders.data)
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
