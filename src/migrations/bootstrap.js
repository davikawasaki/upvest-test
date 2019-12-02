const connect = require('../database');
const convertBlocksFromCSV = require('./blocks.populate');
const convertTransactionsFromCSV = require('./transactions.populate');
const { getAddressesFromEthBalanceCSV, getContractsFromERC20BalanceCSV } = require('./addresses.populate');

const conn = connect();
conn.once("open", function() {
  console.log("MongoDB connected successfully");
  conn.db.dropCollection("blocks", function(err, res) { console.log("Collection blocks dropped.") })
  conn.db.dropCollection("transactions", function(err, res) { console.log("Collection transactions dropped.") })
  conn.db.dropCollection("contracts", function(err, res) { console.log("Collection contracts dropped.") })
  conn.db.dropCollection("addresses", function(err, res) { console.log("Collection addresses dropped.") })
});

Promise
  .all(
    [convertBlocksFromCSV(), convertTransactionsFromCSV()]
      .map(p => p.catch(err => {
        console.error(err);
        return err;
      }))
  )
  .then(res => {
    return Promise.all(
      [getContractsFromERC20BalanceCSV(), getAddressesFromEthBalanceCSV()]
        .map(p => p.catch(err => {
          console.error(err);
          return err;
        }))
    )
  })
  .then(res => {
    conn.close();
  })
  .catch(err => {
    console.log(err);
    conn.close();
  })