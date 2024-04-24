const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder, ChannelSelectMenuBuilder} = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const {getUri} = require("axios");

module.exports = {
    name: 'savechan',
    description: 'Save channel',
    descriptionLocalizations: {
        fr: 'Save chan',
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

        const selectChannelToSaveMenu = new StringSelectMenuBuilder()
            .setCustomId('selectChannelToSave')
            .addOptions(options);

        const actionRow = new ActionRowBuilder()
            .addComponents(selectChannelToSaveMenu);

        await interaction.reply({ content: await trans(guildId, 'channel_to_save_selected'), components: [actionRow], ephemeral: true });

    }
}
