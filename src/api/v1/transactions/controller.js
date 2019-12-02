const { Error } = require('../../../utils/api-response');
const Transaction = require('./model');

const loadAll = async (req, res, next) => {
	try {
    let perPage = 30;
    let dbSearchParams = {};
    let {
      query: { page, limit, sortBy, startDate, endDate },
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
    
    // Apply date filter in case it's set on query params; override quantity of documents
    if (startDate && endDate) {
      dbSearchParams['timestamp'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const countOverride = await Transaction.find(dbSearchParams).count();

    Transaction
    .find(dbSearchParams)
    .select('-_id -__v')
    .limit(perPage)
    .skip(perPage * page)
    .sort({ name: 'asc' })
    .exec((err1, data) => {
        Transaction.countDocuments().exec((err2, count) => {
          if (!err1 && !err2) {
            if (countOverride !== count) count = countOverride;
            res.status(200).json({
              transactions: data,
              page: page + 1,
              pages: Math.ceil(count / perPage)
            })
          }
          else {
            throw new Error({
              message: 'It was not possible to extract the transactions.',
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
      params: { hash },
    } = req;
    
    const transaction = await Transaction.findOne({ hash }, {'_id': 0, '__v': 0});

    if (!transaction) {
      throw new Error({
        message: 'Transaction hash does not exist.',
        status: 400,
      });
    }

    res.status(200).json(transaction);
  } catch (e) {
    next(e);
  }
};

module.exports = { loadAll, loadSpecific };