const config = (params) =>({
  server: {
    static: {
      port: 8000,
    },
    web: {
      port: 8001,
    }
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
  }

});

module.exports = config;
