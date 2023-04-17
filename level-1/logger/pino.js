const pino = require('pino')
const logger = pino()

const customConsole = {
  log: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  info: logger.info.bind(logger),
  debug: logger.debug.bind(logger),
}

// Можно использовать `customConsole` вместо нативного `console`
module.exports = customConsole
