const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder, ChannelSelectMenuBuilder} = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const {getUri} = require("axios");

module.exports = {
    name: 'addboard',
    description: 'Add a new ticket board',
    descriptionLocalizations: {
        fr: 'Ajoute un nouveau panel à tickets',
    },
    permissions: ['MANAGE_MESSAGES'],
    runSlash: async (client, interaction) => {
        const guildId = interaction.guild.id;
        const roles = await interaction.guild.roles.fetch();
        const roleOptions = roles.map(role => ({
            label: role.name,
            value: role.id
        }));

        const roleSelectMenu = new StringSelectMenuBuilder()
            .setCustomId('selectViewerRole')
            .addOptions(roleOptions);

        const actionRow = new ActionRowBuilder()
            .addComponents(roleSelectMenu);

        await interaction.reply({ content: await trans(guildId, 'viewer_role_select'), components: [actionRow], ephemeral: true });

    }
}
