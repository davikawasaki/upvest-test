
const express = require('express');
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const Ddos = require('ddos');
const ExpressLogs = require('express-server-logs');
const routes = require('./api/v1/router');
const error = require('./middlewares/error');
const { whitelist, ddosConfig } = require('./config');

const ddosInstance = new Ddos(ddosConfig);

const corsOptions = {
  exposedHeaders: '',
  origin: (origin, callback) => {
    console.log(`+++++++ CORS Origin Sniffer: ${origin}.`);
    if (!origin || whitelist.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
};

const expressLogs = new ExpressLogs(false);
const server = express();

// NPM module for preventing DDoS attack.
// See more https://www.npmjs.com/package/ddos
server.use(ddosInstance.express);

// Parse body params and attach them to req.body
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(expressLogs.logger);

// GZIP compression to reduce size of payloads
server.use(compress());

// Secure servers by setting various HTTP headers for security
server.use(helmet());
// Enable CORS (Cross Origin Resource Sharing)
server.use(cors(corsOptions));

// Mount API Routes
server.use('/v1', routes);

// Catch 404 and forward to error handler
server.use(error.notFound);
// Error handler. It sends a stacktrace only during development
server.use(error.handler);

module.exports = server;