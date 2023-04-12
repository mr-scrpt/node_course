'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(bodyParser.json())

module.exports = async (routing, port) => {
  for (const [serviceName, service] of Object.entries(routing)) {
    for (const [method, func] of Object.entries(service)) {
      const path = `/${serviceName}/${method}*`
      app.post(path, async (req, res) => {
        console.log('req.path', req.path)
        const requestPath = req.path.split('/')
        const index = requestPath.indexOf(method)

        let paramsRequest
        if (index !== -1 && index < requestPath.length - 1) {
          const result = requestPath[index + 1]
          paramsRequest = result
        }

        const result = await func(paramsRequest)
        res.send(JSON.stringify(result.rows))
      })
    }
  }
  app.listen(port, () => {
    console.log(`Express API server running on port ${port}`)
  })
}
