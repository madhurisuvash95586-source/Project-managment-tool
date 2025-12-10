const mongoose = require('mongoose');
const TimeEntrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    startedAt: Date,
    stoppedAt: Date,
    durationSeconds: Number
}, { timestamps: true });
module.exports = mongoose.model('TimeEntry', TimeEntrySchema);