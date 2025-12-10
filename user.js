const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);