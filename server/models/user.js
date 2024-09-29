const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    savedBooks: Array
});

module.exports = mongoose.model('User', userSchema);
