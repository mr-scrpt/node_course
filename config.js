const config = (params) =>({
  server: {
    port: 4000,
  },
  database: {
    host: 'localhost',
    port: 5432,
    name: 'node_chat',
    user: 'node_chat',
    password: 'pgpass',
  },
});

module.exports = config;
