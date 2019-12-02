const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Transaction = require('../api/v1/transactions/model');
const Contract = require('../api/v1/contracts/model');
const Address = require('../api/v1/addresses/model');

const getAddressesFromEthBalanceCSV = () => {
  const streamAdd = new Promise(async (resolve, reject) => {
    
    let addresses = [];
    fs.createReadStream(path.resolve(__dirname, '../storage/eth-ropsten-eth-balance.csv'))
      .pipe(csv())
      .on('data', async (data) => {
        const payload = JSON.parse(data.payload);
        const addressHash = data.address || payload.address;
        const transaction = await _addNewTransactionIfNotExists(data, payload);
        if (addressHash) {
          const addressDB = await Address.findOne({ hash: addressHash });
          const add = addresses.filter(a => a.hash == addressHash);
          if (add && add.length == 1) {
            addresses = addresses.map(a => {
              if (a.hash === addressHash) {
                if (a.transactions.filter(t =>
                  t === payload.transactionHash).length == 0) {
                    if (transaction) {
                      a.transactions.push(transaction.hash);
                    }
                  }
                }
                return a;
              })
            }
            else if (!addressDB && addressHash) {
              addresses.push({
              hash: addressHash,
              transactions: transaction ? [transaction.hash] : [],
            })
          }
          else {
            if (addressDB.transactions.filter(t =>
            t === payload.transactionHash).length == 0) {
              if (transaction) {
                addressDB.transactions.push(transaction.hash);
                Address.updateOne({ hash: addressDB.hash }, addressDB, (err) => {
                  if (err) console.log(`Error at updating transactions from specific address ${addressDB.hash}.`);
                })
              }
            }
          }
        }
      })
      .on('end', function() {
        try {
          Address.insertMany(addresses, (err, res) => {
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

const getContractsFromERC20BalanceCSV = () => {
  const streamAdd = new Promise(async (resolve, reject) => {
    
    let contracts = [];
    fs.createReadStream(path.resolve(__dirname, '../storage/eth-ropsten-erc20-balance.csv'))
      .pipe(csv())
      .on('data', async (data) => {
        const payload = JSON.parse(data.payload);
        const contractHash = data.contract || payload.contract;
        const transaction = await _addNewTransactionIfNotExists(data, payload, data.contract);
        if (contractHash) {
          const cont = contracts.filter(c => c.hash == contractHash);
          if (cont && cont.length == 1) {
            contracts = contracts.map(c => {
              if (c.hash === contractHash) {
                if (c.transactions
                  .filter(t => t.hash === payload.transactionHash).length == 0) {
                    if (transaction) c.transactions.push(transaction.hash);
                }
              }
              return c;
            })
          }
          else if (contractHash) {
            contracts.push({
              hash: contractHash,
              transactions: transaction ? [transaction.hash] : [],
              type: 'in'
            })
          }
        }
      })
      .on('end', function() {
        try {
          Contract.insertMany(contracts, (err, res) => {
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

const _addNewTransactionIfNotExists = async (data, payload, to, from) => {
  let _transaction = null;
  if (payload && payload.transactionHash) {
    _transaction = await Transaction.findOne({ hash: payload.transactionHash });
    if (!_transaction) {
      new Transaction({
        hash: payload.transactionHash,
        blockHash: data.blockHash,
        blockNumber: data.blockNumber,
        to: to || '',
        from: from || '',
        input: data.input || '',
        balance: payload.balance || '0',
        timestamp: new Date(payload.timestamp) || null,
        type: 'in'
      }).save((err, res) => {
        if (err) return null;
        else return res;
      })
    }
    else {
      _transaction.timestamp = new Date(payload.timestamp) || null;
      _transaction.balance = payload.balance || '0';
      _transaction.type = 'in';
      _transaction = await Transaction.findOneAndUpdate({ hash: payload.transactionHash }, _transaction);
      return _transaction;
    };
  }
}

module.exports = {
  getAddressesFromEthBalanceCSV,
  getContractsFromERC20BalanceCSV
};