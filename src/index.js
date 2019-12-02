// eslint-disable-next-line no-global-assign
const { port, env } = require('./config');
const server = require('./server');
const connect = require('./database');

connect();

server.listen(port, () => {
  console.info(`[${new Date()}] Server started on port ${port} (${env})`);
});

module.exports = server;