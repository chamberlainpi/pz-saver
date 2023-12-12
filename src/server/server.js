import { makeRoutesFromObj, tryLoadFile } from './sv-extensions.js'
import Fastify from 'fastify'
import FastifyStatic from 'fastify-static'
import 'colors'
import _ from 'lodash'
import { createRoutes } from './sv-routes.js'
import path from 'path'
import yaml from 'yaml'

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
fastify.addHook('onError', async (req, res, error) => {
  trace('Server Error!'.red, error)
})

makeRoutesFromObj(fastify, createRoutes(state))

//Load config here
;(async () => {
  state.config = await tryLoadFile(state.YAML_CONFIG, { pzRoot: 'not-set' })

  const toColoredLines = str =>
    str
      //no-format
      .split('\n')
      .filter(line => line.trim().length)
      .map(line => line.split(': '))
      .map(parts => [parts[0].magenta, parts[1].green].join(': '))
      .join('\n')

  trace('YAML Config:\n', toColoredLines(yaml.stringify(state.config)))
})()

fastify.ready(err => {
  if (err) throw err

  clear()
  trace('Fastify server ready!'.magenta, `http://localhost:${PORT}`.cyan)
  const args = [...process.execArgv, ...process.argv]
  trace('Using process args:\n', args.join(' ').yellow)
})

fastify.listen(PORT)
