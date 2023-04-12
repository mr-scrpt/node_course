const config = (params) => ({
  server: {
    statics: {
      port: 8000,
    },
    api: {
      port: 8001,
    },
  },

  database: {
    host: 'localhost',
    port: 5432,
    name: 'node_chat',
    user: 'node_chat',
    password: 'pgpass',
  },

  loader: {
    timeout: 5000,
    displayErrors: false,
  },
  // transport: 'ws',
  // transport: 'http',
  transport: 'express',
})

module.exports = config
