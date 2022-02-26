import { wait } from './utils/extensions'
const socket = io('http://localhost:3000')

socket.on('connect', async () => {
  trace('SOCKET IO CONNECTED', socket.id)
})

socket.on('disconnect', () => {
  console.log('Disconnected...', socket.id)
})

socket.on('error', () => {
  console.log('Could not connect / error...')
})

export default socket
