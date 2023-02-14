import { makeRoutesFromObj, tryLoadFile } from './sv-extensions.js'
import Fastify from 'fastify'
import FastifyStatic from 'fastify-static'
import 'colors'
import _ from 'lodash'
import { createRoutes } from './sv-routes.js'
import axios from 'axios'
import path from 'path'

globalThis.trace = console.log.bind(console)

const PORT = process.env.PORT || 3000
const clear = () => {
  process.stdout.write('\u001b[2J\u001b[0;0H')
}

process.on('unhandledRejection', err => {
  console.log(err.toString().red)
})

const state = {
  YAML_CONFIG: '.private/pzconfig.yaml',
  PRIVATE_DIR: '.private',
  DIST: path.join(process.cwd(), '/dist'),
  ZIP_SNAPSHOT: '.private/[name].snap.zip',
  config: {},
}

const fastify = Fastify()
fastify.register(FastifyStatic, { root: state.DIST })
fastify.addHook('onError', async (request, reply, error) => {
  trace('Server Error!'.red, error)
})

makeRoutesFromObj(fastify, createRoutes(state))

const TEST_API = axios.create({ baseURL: `http://localhost:${PORT}/` })

;(async () => {
  state.config = await tryLoadFile(state.YAML_CONFIG, { pzRoot: 'not-set' })
  trace('YAML Config Successfully loaded:\n', state.config)

  //Can make `TEST_API` calls here...
})()

fastify.ready(err => {
  if (err) throw err

  clear()
  trace('Fastify server ready!'.magenta, `http://localhost:${PORT}`.cyan)
})

fastify.listen(PORT)
