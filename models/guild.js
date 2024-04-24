const mongoose = require('mongoose');

const guildSchema = mongoose.Schema ({
    id: String,
    lg: {'type': String, 'default': 'en'},
    transcriptChannel: String,
    logChannel: {'type': String, 'default': '949340522718310400'}
});

module.exports = mongoose.model('Guild', guildSchema);