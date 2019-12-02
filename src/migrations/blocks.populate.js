const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Block = require('../api/v1/blocks/model');

function convertBlocksFromCSV() {
  const streamAdd = new Promise((resolve, reject) => {
    let blocks = [];
    fs.createReadStream(path.resolve(__dirname, '../storage/eth-ropsten-blocks.csv'))
      .pipe(csv())
      .on('data', function (data) {
        const payload = JSON.parse(data.payload);
        const search = blocks.filter(b => b.number == data.number);
        if (search && search.length == 0) {
          blocks.push({
            number: parseInt(data.number) || 0,
            hash: data.hash || '',
            nonce: payload.nonce || '',
            miner: payload.miner || '',
            difficulty: payload.difficulty || '',
            totalDifficulty: payload.totalDifficulty || '',
            extraData: payload.extraData || '',
            size: payload.size || '',
            gasLimit: payload.gasLimit || '',
            gasUsed: payload.gasUsed || '',
            transactions: payload.transactions,
            timestamp: payload.timestamp || '',
            uncles: payload.uncles || []
          })
        }
      })
      .on('end', function() {
        try {
          Block.insertMany(blocks, (err, res) => {
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

module.exports = convertBlocksFromCSV;