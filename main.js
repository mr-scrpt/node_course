'use strict'

const fsp = require('node:fs').promises
const path = require('node:path')
const serverWs = require('./ws.js')
const serverHttp = require('./http.js')
const staticServer = require('./static.js')
const load = require('./load.js')
const db = require('./db.js')
const hash = require('./hash.js')
const logger = require('./logger.js')
const { statics, web } = require('./config.js')().server
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
    serverHttp(routing, statics.port)
  } else if (transport === 'ws') {
    staticServer('./static', statics.port)
    serverWs(routing, web.port)
  }
})()
