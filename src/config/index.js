require('dotenv').config();

/** Default config will remain same in all environments and can be over-ridded */
let config = {
  baseUrl: 'http://localhost:3000',
  ddosConfig: {
    burst: 100,
    limit: 100,
  },
  env: process.env.NODE_ENV,
  mongo: { uri: 'mongodb://localhost:27017/ethdatasets' },
  port: 3000,
  website: 'http://localhost:3000',
  whitelist: null,
};

if (process.env.NODE_ENV === 'staging') {
  config = {
    mongo: { uri: 'mongodb://localhost:27017/ethdatasets' },
  };
} else if (process.env.NODE_ENV === 'production') {
  config = {
    mongo: { uri: process.env.MONGODB_URI },
    whitelist: [],
  };
}

module.exports = config;