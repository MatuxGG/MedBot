const { trans } = require('../../utils/Translator.js');
const { Guild } = require('../../models/index');

module.exports = {
    name: 'selectCountChannelMenu',
    run: async (client, interaction) => {
        const guildId = interaction.guild.id;
        const selectChannelId = interaction.values[0];
        const message = await trans(guildId, 'count_channel_saved');

        let membersText = await trans(guildId, 'members');
        let membersCount = interaction.guild.members.cache.size;
        let channel = interaction.guild.channels.cache.get(selectChannelId);
        if (channel) {
            channel.setName(`${membersCount} ${membersText}`);
            console.log(`Updating members count in "${channel.name}" to ${membersCount}`);
        }

        Guild.findOneAndUpdate( { id: interaction.guild.id }, { membersCountChannel: selectChannelId }, function (err, weekCalendar) {
            interaction.reply({content: message, ephemereal: true});
        });
    }
}
