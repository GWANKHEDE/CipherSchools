const Assignment = require('../models/Assignment');
const { AppError } = require('../utils/errorHandler');
const catchAsync = require('../utils/catchAsync');
const { sandboxPool } = require('../config/db');

const pool = sandboxPool;

exports.getAllAssignments = catchAsync(async (req, res, next) => {
    const assignments = await Assignment.find().sort({ createdAt: 1 });
    res.json(assignments);
});

exports.getAssignmentById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);

    if (!assignment) {
        return next(new AppError('Assignment not found', 404));
    }

    const populatedSampleTables = [];
    if (assignment.sampleTables && assignment.sampleTables.length > 0) {
        for (let tableObj of assignment.sampleTables) {
            try {
                if (/^[a-zA-Z0-9_]+$/.test(tableObj.tableName)) {
                    const result = await pool.query(`SELECT * FROM ${tableObj.tableName} LIMIT 5`);
                    populatedSampleTables.push({
                        ...tableObj.toObject(),
                        rows: result.rows
                    });
                } else {
                    populatedSampleTables.push(tableObj);
                }
            } catch (e) {
                console.warn(`Could not fetch sample for ${tableObj.tableName}:`, e.message);
                populatedSampleTables.push(tableObj);
            }
        }
    }

    const responseData = assignment.toObject();
    if (populatedSampleTables.length > 0) {
        responseData.sampleTables = populatedSampleTables;
    }

    res.json(responseData);
});
