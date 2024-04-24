const mongoose = require('mongoose');

const guildSchema = mongoose.Schema ({
    id: String,
    hours: Number,
    minutes: Number,
    guildId: String,
});

module.exports = mongoose.model('ChanToClean', guildSchema);