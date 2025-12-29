const executionService = require('../services/executionService');
const { AppError } = require('../utils/errorHandler');

exports.execute = async (req, res, next) => {
    const { query } = req.body;
    if (!query) return next(new AppError('Query is required', 400));

    try {
        const result = await executionService.executeSQL(query);
        res.json(result);
    } catch (err) {
        next(new AppError(err.message, err.message.includes('Only SELECT') ? 403 : 400));
    }
};
