const mongoose = require('mongoose');

const guildSchema = mongoose.Schema ({
    id: String,
    formattedId: String,
    channelId: String,
    ownerId: String,
    viewerId: String,
    state: String,
    startDate: Date,
    guildId: String,
});

module.exports = mongoose.model('Ticket', guildSchema);