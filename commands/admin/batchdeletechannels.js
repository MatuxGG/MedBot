const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'batchdeletechannels',
    permissions: ['ADMINISTRATOR'],
    description: 'Delete ALL channels and categories',
    options: [
        {
            name: 'confirm',
            description: 'Confirm that you wanna do this',
            type: ApplicationCommandOptionType.String,
            required: 'true',
            choices: [
                {
                    name: 'Cancel',
                    value: 'no'
                },
                {
                    name: 'Confirm',
                    value: 'yes'
                },
            ]
        }
    ],
    runSlash: (client, interaction) => {
        let confirm = interaction.options.getString('confirm');
        if (confirm === 'no') {
            interaction.reply({ content: 'Batch delete canceled', ephemeral: true })
            return;
        }
        const currentChannelId = interaction.channelId;
        const channels = interaction.guild.channels.cache;

        for (const [channelId, channel] of channels) {
            if (channelId !== currentChannelId) {
                channel.delete();
            }
        }
        interaction.reply({ content: 'Batch delete terminated', ephemeral: true })
    }
}
