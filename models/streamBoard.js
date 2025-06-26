const mongoose = require('mongoose');

const guildSchema = mongoose.Schema ({
    id: String,
    channelId: String,
    guildId: String,
});

module.exports = mongoose.model('StreamBoard', guildSchema);