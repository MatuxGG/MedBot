const mongoose = require('mongoose');

const guildSchema = mongoose.Schema ({
    id: String,
    channelId: String,
});

module.exports = mongoose.model('ChallengerBoard', guildSchema);