const config = {
  statics: {
    port: 8000,
  },
  api: {
    port: 8001,
    // transport: 'ws',
    transport: 'http',
    // transport: 'express',
  },

  database: {
    host: 'localhost',
    port: 5432,
    name: 'node_chat',
    user: 'node_chat',
    password: 'pgpass',
  },

  sandbox: {
    timeout: 5000,
    displayErrors: false,
  },
  logger: {
    pathToLogFolder: './log',
    colors: {
      info: '\x1b[1;37m',
      debug: '\x1b[1;33m',
      error: '\x1b[0;31m',
      system: '\x1b[1;34m',
      access: '\x1b[1;38m',
    },
  },
}

module.exports = config
