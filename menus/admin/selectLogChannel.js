const { trans } = require('../../utils/Translator.js');
const { Guild } = require('../../models/index');

module.exports = {
    name: 'selectLogChannel',
    run: async (client, interaction) => {
        const guildId = interaction.guild.id;
        const selectChannelId = interaction.values[0];
        const message = await trans(guildId, 'log_channel_saved');

        Guild.findOneAndUpdate( { id: interaction.guild.id }, { logChannel: selectChannelId }, function (err, weekCalendar) {
            interaction.reply({content: message, ephemeral: true});
        });
    }
}
