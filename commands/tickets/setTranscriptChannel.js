const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder, ChannelSelectMenuBuilder} = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const {getUri} = require("axios");

module.exports = {
    name: 'settranscriptchannel',
    description: 'Set the transcript channel for saved tickets',
    descriptionLocalizations: {
        fr: 'Choisis un salon de transcript pour les tickets sauvegardés',
    },
    permissions: ['MANAGE_MESSAGES'],
    runSlash: async (client, interaction) => {
        const guildId = interaction.guild.id;
        const textChannels = interaction.guild.channels.cache.filter((ch) => ch.type === 0);

        const options = textChannels.map(channel => {
            return {
                label: channel.name,
                value: channel.id,
            };
        });

        const transcriptChannelMenu = new StringSelectMenuBuilder()
            .setCustomId('selectTranscriptChannel')
            .addOptions(options);

        const actionRow = new ActionRowBuilder()
            .addComponents(transcriptChannelMenu);

        await interaction.reply({ content: await trans(guildId, 'transcript_channel_select'), components: [actionRow], ephemeral: true });

    }
}
