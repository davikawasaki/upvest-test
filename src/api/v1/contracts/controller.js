const { Error } = require('../../../utils/api-response');
const Contract = require('./model');
const Transaction = require('../transactions/model');

const loadAll = async (req, res, next) => {
	try {
    let perPage = 30;
    let {
      query: { page, limit, sortBy, filterBalance },
      params: {},
    } = req;
    
    // Page query rules
    if (!page || page <= 0) page = 0;
    else page--;

    // Page limit rules
    if (!limit && limit > 0) perPage = limit;

    // Sort by
    if (!sortBy) sortBy = 'asc';
    else if(sortBy && sortBy === '0') sortBy = 'desc';
    else if(sortBy && sortBy === '1') sortBy = 'asc';

    Contract
      .find()
      .select('-_id -__v')
      .limit(perPage)
      .skip(perPage * page)
      .sort({ name: 'asc' })
      .exec((err1, data) => {
        Contract.countDocuments().exec((err2, count) => {
          if (!err1 && !err2) {
            res.status(200).json({
              contracts: data,
              page: page + 1,
              pages: Math.ceil(count / perPage)
            })
          }
          else {
            throw new Error({
              message: 'It was not possible to extract the contracts.',
              status: 400,
            });
          }
        })
      });
  } catch (err) {
    throw new Error({
      message: 'Something is wrong with the API server. Try again later.',
      status: 500,
    });
  }
}

const loadSpecific = async (req, res, next) => {
  try {
    const {
      query: {},
      params: { hash, orderBy, filterBy },
    } = req;
    
    const contract = await Contract.findOne({ hash }, {'_id': 0, '__v': 0});

    if (!contract) {
      throw new Error({
        message: 'Contract hash does not exist.',
        status: 400,
      });
    }

    res.status(200).json(contract);
  } catch (e) {
    next(e);
  }
};

const calculateBalance = async (req, res, next) => {
  try {
    const {
      query: {},
      params: { hash },
    } = req;

    const contract = await Contract.findOne({ hash }, {'_id': 0, '__v': 0});

    if (!contract) {
      throw new Error({
        message: 'Contract hash does not exist.',
        status: 400,
      });
    }
    
    let balance = 0;
    
    /**
     * Calculation is done getting all transactions associated to the address
     * and checking if it was:
     * - A withdraw (i.e. 'from hash' equals the address in question)
     * - A deposit (i.e. 'to hash' equals the address in question)
     */
    if (contract.transactions.length == 0) {
      contract.transactions = await Transaction.find(
        { $or: [ { 'to': hash }, { 'from': hash } ] }, {'_id': 0, '__v': 0}
      );
    }

    console.log(contract.transactions.length)
    
    const transactions = await Transaction.find(
      { hash: {$in: contract.transactions} },
      {'_id': 0, '__v': 0}
    );
    
    if (transactions && transactions.length > 0) {
      transactions.forEach(t => {
        if (t.to === hash) balance += parseInt(t.value || '0');
        else if (t.from === hash) balance -= parseInt(t.value || '0');
      });
    }
    
    res.status(200).json({balance});
  } catch (err) {
    next(err);
  }
};


module.exports = { loadAll, loadSpecific, calculateBalance };