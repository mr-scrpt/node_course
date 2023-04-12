'use strict'

const fsp = require('node:fs').promises
const path = require('node:path')
const serverWs = require('./ws.js')
const serverHttp = require('./http.js')
const serverExpress = require('./express.js')
const staticServer = require('./static.js')
const load = require('./load.js')
const db = require('./db.js')
const hash = require('./hash.js')
const logger = require('./logger.js')
const { statics, api } = require('./config.js')().server
const { transport } = require('./config.js')()

const sandbox = {
  console: Object.freeze(logger),
  db: Object.freeze(db),
  common: { hash },
}
const apiPath = path.join(process.cwd(), './api')
const routing = {}

;(async () => {
  const files = await fsp.readdir(apiPath)
  for (const fileName of files) {
    if (!fileName.endsWith('.js')) continue
    const filePath = path.join(apiPath, fileName)
    const serviceName = path.basename(fileName, '.js')
    routing[serviceName] = await load(filePath, sandbox)
  }

  if (transport === 'http') {
    serverHttp(routing, api.port)
  } else if (transport === 'express') {
    serverExpress(routing, api.port)
  } else if (transport === 'ws') {
    serverWs(routing, api.port)
  }
  staticServer('./static', statics.port)
})()
