// ticketBoard

const mongoose = require('mongoose');

const guildSchema = mongoose.Schema ({
    id: String,
    nextId: Number,
    ticketTitle: String,
    ticketContent: String,
    roleId: String,
    channelName: String,
    guildId: String,
});

module.exports = mongoose.model('Board', guildSchema);