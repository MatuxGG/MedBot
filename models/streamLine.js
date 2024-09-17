// streamer

const mongoose = require('mongoose');

const guildSchema = mongoose.Schema ({
    id: String,
    channelId: String,
    guildId: String,
    userId: String,
});

module.exports = mongoose.model('StreamLine', guildSchema);