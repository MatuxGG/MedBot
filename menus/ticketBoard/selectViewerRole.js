const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, SelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { Board } = require('../../models/index');

module.exports = {
    name: 'selectViewerRole',
    run: async (client, interaction) => {
        const selectedRoleId = interaction.values[0];

        const guildId = interaction.guild.id;

        const modal = new ModalBuilder()
            .setCustomId(`createboard-${selectedRoleId}`)
            .setTitle(await trans(guildId, 'board_create'));

        const title = new TextInputBuilder()
            .setCustomId('boardTitle')
            .setLabel(await trans(guildId, 'board_title'))
            .setStyle(TextInputStyle.Short);

        const content = new TextInputBuilder()
            .setCustomId('boardContent')
            .setLabel(await trans(guildId, 'board_content'))
            .setStyle(TextInputStyle.Paragraph);

        const ticketTitle = new TextInputBuilder()
            .setCustomId('ticketTitle')
            .setLabel(await trans(guildId, 'ticket_title'))
            .setStyle(TextInputStyle.Short);

        const ticketContent = new TextInputBuilder()
            .setCustomId('ticketContent')
            .setLabel(await trans(guildId, 'ticket_content'))
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Available vars :\n- %SENDER%: User that created the ticket\n- %ROLE%: Role in charge of tickets');

        const firstActionRow = new ActionRowBuilder().addComponents(title);
        const secondActionRow = new ActionRowBuilder().addComponents(content);
        const thirdActionRow = new ActionRowBuilder().addComponents(ticketTitle);
        const fourthActionRow = new ActionRowBuilder().addComponents(ticketContent);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);

        await interaction.showModal(modal);
    }
}
