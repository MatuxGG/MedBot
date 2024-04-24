const mongoose = require('mongoose');

const guildSchema = mongoose.Schema ({
    id: String,
    hours: Number,
    minutes: Number
});

module.exports = mongoose.model('ChanToClean', guildSchema);