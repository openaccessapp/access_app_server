const mongoose = require('mongoose');

const dateTimeSchema = mongoose.Schema({
    _id: String,
    fromDate: String,
    toDate: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Access', dateTimeSchema);