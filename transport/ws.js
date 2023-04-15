'use strict'

// const console = require('./logger.js')
const { Server } = require('ws')

module.exports = (console) => (routing, port) => {
  // const console = require('./logger.js')(options)
  const ws = new Server({ port })

  ws.on('connection', (connection, req) => {
    const ip = req.socket.remoteAddress
    connection.on('message', async (message) => {
      console.log(`Websoket logger: ${ip} ${message}`)
      const obj = JSON.parse(message)
      const { name, method, args = [] } = obj
      const entity = routing[name]
      if (!entity) return connection.send('"Not found"', { binary: false })
      const handler = entity[method]
      if (!handler) return connection.send('"Not found"', { binary: false })
      const json = JSON.stringify(args)
      const parameters = json.substring(1, json.length - 1)
      console.log(`${ip} ${name}.${method}(${parameters})`)
      try {
        const result = await handler(...args)
        connection.send(JSON.stringify(result), { binary: false })
      } catch (err) {
        console.error(err)
        connection.send('"Server error"', { binary: false })
      }
    })
  })

  console.log(`Websoket API server running on port ${port}`)
}
