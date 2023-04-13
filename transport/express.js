'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(bodyParser.json())

module.exports = (console) => async (routing, port) => {
  for (const [serviceName, service] of Object.entries(routing)) {
    for (const [method, func] of Object.entries(service)) {
      const path = `/${serviceName}/${method}*`
      app.post(path, async (req, res) => {
        const { url, socket, params } = req
        const [name, method] = url.substring(1).split('/')
        const ip = socket.localAddress
        const requestPath = req.path.split('/')
        const index = requestPath.indexOf(method)

        let paramsRequest
        if (index !== -1 && index < requestPath.length - 1) {
          const result = requestPath[index + 1]
          paramsRequest = result
        }

        console.log(
          `Express logger: ${ip} ${name}.${method}(${JSON.stringify(params)})`
        )
        const result = await func(paramsRequest)
        res.send(JSON.stringify(result.rows))
      })
    }
  }
  app.listen(port, () => {
    console.log(`Express API server running on port ${port}`)
  })
}
