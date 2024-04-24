const mongoose = require('mongoose');

const guildSchema = mongoose.Schema ({
    id: String,
    hours: Number,
    minutes: Number,
    day: Number,
    title: String,
});

module.exports = mongoose.model('WeekCalendar', guildSchema);