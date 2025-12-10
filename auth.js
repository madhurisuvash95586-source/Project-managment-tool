const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ message: 'No token' });
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(payload.id).select('-passwordHash');
        next();
    } catch (e) { res.status(401).json({ message: 'Invalid token' }); }
};

exports.role = (...allowed) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Auth required' });
    if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
};