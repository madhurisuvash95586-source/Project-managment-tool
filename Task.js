const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    project: String,
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    estimateHours: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Task', TaskSchema);