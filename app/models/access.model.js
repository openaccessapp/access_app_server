const mongoose = require('mongoose');

const dateTimeSchema = mongoose.Schema({
    dateTime: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Access', dateTimeSchema);