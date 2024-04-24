const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder, ChannelSelectMenuBuilder} = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const {getUri} = require("axios");

module.exports = {
    name: 'setlogchannel',
    description: 'Set the logs channel for this server',
    descriptionLocalizations: {
        fr: 'Choisis un salon de logs pour ce serveur',
    },
    permissions: ['ADMINISTRATOR'],
    runSlash: async (client, interaction) => {
        const guildId = interaction.guild.id;
        const textChannels = interaction.guild.channels.cache.filter((ch) => ch.type === 0);

        const options = textChannels.map(channel => {
            return {
                label: channel.name,
                value: channel.id,
            };
        });

        const logChannelMenu = new StringSelectMenuBuilder()
            .setCustomId('selectLogChannel')
            .addOptions(options);

        const actionRow = new ActionRowBuilder()
            .addComponents(logChannelMenu);

        await interaction.reply({ content: await trans(guildId, 'log_channel_select'), components: [actionRow], ephemeral: true });

    }
}
