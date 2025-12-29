const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy'
    },
    question: {
        type: String,
        required: true
    },
    sampleTables: [{
        tableName: String,
        columns: [{
            columnName: String,
            dataType: String
        }],
        rows: []
    }],
    expectedOutput: {
        type: {
            type: String,
            enum: ['table', 'single_value', 'column', 'count'],
            required: true
        },
        value: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
