const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder, ActionRowBuilder} = require("discord.js");
const { Guild } = require('../../models/index');
const { trans } = require('../../utils/Translator.js');

module.exports = {
    name: 'setmemberscount',
    description: 'Set a members counter channel',
    descriptionLocalizations: {
        fr: 'Définir un salon de compteur de membres'
    },
    permissions: ['MANAGE_MESSAGES'],
    runSlash: async (client, interaction) => {
        const guildId = interaction.guild.id;
        const voiceChannels = interaction.guild.channels.cache.filter((ch) => ch.type === 2);

        if (voiceChannels.size === 0) {
            await interaction.reply({ content: await trans(guildId, 'no_voice_channel'), ephemeral: true });
            return;
        }

        const options = voiceChannels.map(channel => {
            return {
                label: channel.name,
                value: channel.id,
            };
        });

        const selectCountChannelMenu = new StringSelectMenuBuilder()
            .setCustomId('selectCountChannelMenu')
            .addOptions(options);

        const actionRow = new ActionRowBuilder()
            .addComponents(selectCountChannelMenu);

        await interaction.reply({ content: await trans(guildId, 'count_channel_select'), components: [actionRow], ephemeral: true });
    }
}
