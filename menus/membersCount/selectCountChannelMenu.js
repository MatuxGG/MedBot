const { trans } = require('../../utils/Translator.js');
const { Guild } = require('../../models/index');

module.exports = {
    name: 'selectCountChannelMenu',
    run: async (client, interaction) => {
        const guildId = interaction.guild.id;
        const selectChannelId = interaction.values[0];
        const message = await trans(guildId, 'count_channel_saved');

        Guild.findOneAndUpdate( { id: interaction.guild.id }, { membersCountChannel: selectChannelId }, function (err, weekCalendar) {
            interaction.reply({content: message, ephemereal: true});
        });
    }
}
