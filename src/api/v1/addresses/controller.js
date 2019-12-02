const { Error } = require('../../../utils/api-response');
const Address = require('./model');
const Transaction = require('../transactions/model');

/**
 * Loads all available addresses with pagination.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 * @returns JSON response to the requester
 * @throws { Error } Custom error with message and status
 */
const loadAll = async (req, res, next) => {
	try {
    let perPage = 30;
    let {
      query: { page, limit, sortBy },
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

    Address
      .find()
      .select('-_id -__v')  // Remove undesired document items
      .limit(perPage)
      .skip(perPage * page)
      .sort({ name: 'asc' })
      .exec((err1, data) => {
        Address.countDocuments().exec((err2, count) => {
          if (!err1 && !err2) {
            res.status(200).json({
              addresses: data,
              page: page + 1,
              pages: Math.ceil(count / perPage)
            })
          }
          else {
            throw new Error({
              message: 'It was not possible to extract the addresses.',
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

/**
 * Loads specific address from params.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 * @returns JSON response to the requester
 * @throws { Error } Custom error with message and status
 */
const loadSpecific = async (req, res, next) => {
  try {
    const {
      query: {},
      params: { hash },
    } = req;
    
    const address = await Address.findOne({ hash }, {'_id': 0, '__v': 0});

    if (!address) {
      throw new Error({
        message: 'Address hash does not exist.',
        status: 400,
      });
    }

    res.status(200).json(address);
  } catch (err) {
    next(err);
  }
};

/**
 * Calculate the balance from a specific address from params.
 * Addition or subtraction are evaluated through the following:
 * - A withdraw (i.e. 'from hash' equals the address in question)
 * - A deposit  (i.e. 'to hash' equals the address in question)
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * 
 * @returns JSON response to the requester
 * @throws { Error } Custom error with message and status
 */
const calculateBalance = async (req, res, next) => {
  try {
    const {
      query: {},
      params: { hash },
    } = req;

    const address = await Address.findOne({ hash }, {'_id': 0, '__v': 0});

    if (!address) {
      throw new Error({
        message: 'Address hash does not exist.',
        status: 400,
      });
    }
    
    let balance = 0;
    
    // Search for the transactions associated with the hash
    // in case they are not allocated in the address collection
    // (i.e. taking into consideration the to and from attributes)
    if (address.transactions.length == 0) {
      address.transactions = await Transaction.find(
        { $or: [ { 'to': hash }, { 'from': hash } ] }, {'_id': 0, '__v': 0}
      );
    }

    const transactions = await Transaction.find(
      { hash: {$in: address.transactions} },
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