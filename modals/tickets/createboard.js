const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType} = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { Board } = require('../../models/index');

module.exports = {
    name: 'createboard',
    saveData: async (client, interaction, roleId) => {
        const boardTitle = interaction.fields.getTextInputValue('boardTitle');
        const boardContent = interaction.fields.getTextInputValue('boardContent');
        const ticketTitle = interaction.fields.getTextInputValue('ticketTitle');
        const ticketContent = interaction.fields.getTextInputValue('ticketContent');

        const guildId = interaction.guild.id;
        const boardCreatedMessage = await trans(guildId, 'board_created');
        const roleNoExistMessage = await trans(guildId, 'role_no_exist');
        const boardCategory = await trans(guildId, 'board_category')
        const boardPanel = await trans(guildId, 'board_panel');

        const embed = new EmbedBuilder()
            .setTitle(boardTitle)
            .setDescription(boardContent)
        ;

        const ticketCreate = await trans(guildId,'ticket_create')
        const confirm = new ButtonBuilder()
            .setCustomId('createticket')
            .setLabel(ticketCreate)
            .setEmoji('📩')
            .setStyle(ButtonStyle.Primary)
        ;

        const row = new ActionRowBuilder()
            .addComponents(confirm);

        interaction.guild.channels.create({
            name: boardCategory,
            type: ChannelType.GuildCategory,
        })
            .then(category => {
                interaction.guild.channels.create({
                    name: boardPanel,
                    type: ChannelType.GuildText,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ['SendMessages', 'AddReactions', 'CreatePublicThreads', 'CreatePrivateThreads'],
                        }
                    ],
                })
                    .then(channel => {
                        channel.send({
                            embeds: [embed],
                            components: [row]
                        })
                            .then(message => {
                                let createBoard = new Board({ id: category.id, nextId: 0, ticketTitle: ticketTitle, ticketContent: ticketContent, roleId: roleId });
                                createBoard.save().then(b => console.log(`New board : ${b.id}`));

                                interaction.reply({ content: boardCreatedMessage, ephemeral: true });
                            })
                    })
        })
    }
}
