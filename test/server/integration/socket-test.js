import {assert, expect} from 'chai'
import io                 from 'socket.io-client'
import {startServer}      from '../../../server/src/server.js'

const server = startServer()

const socketURL = 'http://localhost:3000'

let result = []

const setup = (io, num) => {
  return new Promise((resolve, reject) => {
    for (let i=1; i < num+1; i++ ) {
      let player = io.connect(socketURL, {
        transports: ['websocket'],
        multiplex: true
      })
      player.on('connect', function() {
        if (i === num) {
          resolve()
        }
      })

      player.on('hello world', a => {
        result.push(a)
      })
    }
  })
}

const breakDown = (io, num) => {
  io.disconnect()
}
describe('Socket IO', () => {

  describe('A socket room', function() {
    this.timeout(5000)
    it('sends unique information to each socket', (done) => {
      setup(io, 5)
        .then(() => {
          server.in('123').clients((error, clients) => {
            clients.map((client) => {
              server.of('/').to(client).emit('hello world', client)
            })
            setTimeout(() => {

            result.map((res) => {
              assert(clients.includes(res), 'the client received a unique message')
            })
            done()
          },100)

          })
        })
    })
  })
})
