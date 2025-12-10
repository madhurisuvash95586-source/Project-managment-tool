const express = require('express');
const Task = require('../models/Task');
const { auth, role } = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    const q = {};
    if (req.query.project) q.project = req.query.project;
    const tasks = await Task.find(q).populate('assignee', 'name email role');
    res.json(tasks);
});

router.post('/', auth, role('admin', 'manager'), async (req, res) => {
    const t = await Task.create(req.body);
    req.io?.emit('task:created', t);
    res.json(t);
});

router.put('/:id', auth, async (req, res) => {
    const t = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignee', 'name email role');
    req.io?.emit('task:updated', t);
    res.json(t);
});

router.delete('/:id', auth, role('admin', 'manager'), async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    req.io?.emit('task:deleted', { id: req.params.id });
    res.json({ message: 'deleted' });
});

module.exports = router;