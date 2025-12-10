const express = require('express');
const TimeEntry = require('../models/TimeEntry');
const Task = require('../models/Task');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/start', auth, async (req, res) => {
    const { taskId } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(400).json({ message: 'Task not found' });
    const entry = await TimeEntry.create({ user: req.user._id, task: task._id, startedAt: new Date() });
    req.io?.emit('time:started', entry);
    res.json(entry);
});

router.post('/stop', auth, async (req, res) => {
    const { entryId } = req.body;
    const e = await TimeEntry.findById(entryId);
    if (!e) return res.status(404).json({ message: 'Entry not found' });
    if (e.stoppedAt) return res.status(400).json({ message: 'Already stopped' });
    e.stoppedAt = new Date();
    e.durationSeconds = Math.round((e.stoppedAt - e.startedAt) / 1000);
    await e.save();
    req.io?.emit('time:stopped', e);
    res.json(e);
});

// simple analytics: time per user
router.get('/analytics', auth, async (req, res) => {
    const agg = await TimeEntry.aggregate([
        { $match: { durationSeconds: { $exists: true } } },
        { $group: { _id: '$user', totalSeconds: { $sum: '$durationSeconds' } } }
    ]);
    res.json(agg);
});

module.exports = router;