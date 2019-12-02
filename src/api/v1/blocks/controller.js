const { Error } = require('../../../utils/api-response');
const Block = require('./model');

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

    Block
      .find()
      .select('-_id -__v')
      .limit(perPage)
      .skip(perPage * page)
      .sort({ name: 'asc' })
      .exec((err1, data) => {
        Block.countDocuments().exec((err2, count) => {
          if (!err1 && !err2) {
            res.status(200).json({
              blocks: data,
              page: page + 1,
              pages: Math.ceil(count / perPage)
            })
          }
          else {
            throw new Error({
              message: 'It was not possible to extract the blocks.',
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
    
    const block = await Block.findOne({ hash }, {'_id': 0, '__v': 0});

    if (!block) {
      throw new Error({
        message: 'Block hash does not exist.',
        status: 400,
      });
    }

    res.status(200).json(block);
  } catch (e) {
    next(e);
  }
};

module.exports = { loadAll, loadSpecific };