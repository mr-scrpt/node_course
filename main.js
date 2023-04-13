'use strict'

const fsp = require('node:fs').promises
const path = require('node:path')
const config = require('./config.js')
const load = require('./load.js')(config.sandbox)
const db = require('./db.js')(config.database)
const hash = require('./hash.js')
const logger = require('./logger/logger.js')(config.logger)

const transport = require(`./transport/${config.api.transport}.js`)(logger)
const staticServer = require('./static.js')(logger)

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

  transport(routing, config.api.port)
  staticServer('./static', config.statics.port)
})()
