const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    sqlQuery: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    attemptCount: {
        type: Number,
        default: 1
    }
}, { timestamps: { createdAt: 'lastAttempt', updatedAt: true } });

module.exports = mongoose.model('UserProgress', userProgressSchema);
