import Fastify from 'fastify'
import FastifyIO from 'fastify-socket.io'
import 'colors'

globalThis.trace = console.log.bind(console)

const fastify = Fastify()

const state = { count: 100 }

fastify.register(FastifyIO, { cors: { origin: '*' } }) //Options for socket.io

fastify.get('/', (req, res) => {
  return 'Hello World'
})

fastify.get('/count', (req, res) => {
  return [state.count]
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
}

fastify.listen(3000)
