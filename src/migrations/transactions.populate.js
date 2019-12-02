const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Block = require('../api/v1/transactions/model');

function convertTransactionsFromCSV() {
  const streamAdd = new Promise((resolve, reject) => {
    let transactions = [];
    fs.createReadStream(path.resolve(__dirname, '../storage/eth-ropsten-transactions.csv'))
      .pipe(csv())
      .on('data', function (data) {
        const payload = JSON.parse(data.payload);
        const duplicates = transactions.filter(t => t.blockHash == data.blockHash);
        if (duplicates && duplicates.length == 0) {
          transactions.push({
            hash: payload.hash || '',
            blockHash: data.blockHash || '',
            blockNumber: parseInt(data.blockNumber) || 0,
            to: data.to || (payload.to || ''),
            from: data.from || (payload.from || ''),
            input: data.input || (payload.input || ''),
            gas: payload.gas || '',
            nonce: payload.nonce || '',
            value: payload.value || '0',
            gas: payload.gas || '',
          })
        }
      })
      .on('end', function() {
        try {
          Block.insertMany(transactions, (err, res) => {
            if (err) reject(err);
            resolve(res);
          });
        } catch (err) {
          reject(err);
        }
      });
  });
  return streamAdd;
};

module.exports = convertTransactionsFromCSV;