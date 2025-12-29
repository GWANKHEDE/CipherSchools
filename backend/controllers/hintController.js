const hintService = require('../services/hintService');
const { AppError } = require('../utils/errorHandler');

exports.getHint = async (req, res, next) => {
    const { assignment, currentQuery } = req.body;
    if (!assignment) return next(new AppError('Assignment details are required', 400));

    try {
        const hint = await hintService.generateHint(assignment, currentQuery);
        res.json({ hint });
    } catch (err) {
        console.error('Hint generation error:', err);
        next(new AppError('Failed to generate hint', 500));
    }
};
