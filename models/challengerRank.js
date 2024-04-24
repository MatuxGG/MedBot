const mongoose = require('mongoose');

const guildSchema = mongoose.Schema ({
    id: Number,
    roleId: String,
    guildId: String,
});

module.exports = mongoose.model('ChallengerRank', guildSchema);