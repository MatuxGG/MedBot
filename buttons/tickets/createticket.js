const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { Board, Ticket } = require('../../models/index');
const { ChannelType } = require('discord.js');
const {config} = require("dotenv");

module.exports = {
    name: 'createticket',
    run: async (client, interaction) => {
        let categoryId = interaction.channel.parent.id;
        const guildId = interaction.guild.id;
        let ticketChannelName = await trans(guildId, 'ticket_open_channel_name');
        let ticketClose = await trans(guildId, 'ticket_close');

        const now = new Date();
        const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
        const ticket = await Ticket.findOne({ ownerId: interaction.user.id, startDate: { $gt: twoMinutesAgo } });
        if (ticket) {
            interaction.reply({content: await trans(guildId, 'wait_for_ticket'), ephemeral: true});
            return;
        }

        Board.findOne({ id: categoryId }, async function (err, board) {
            if (err) {
                console.log(`Create ticket error: ${err}`);
                return;
            }

            if (board) {
                let formattedId = String(board.nextId).padStart(4, '0');

                interaction.guild.channels.create({
                    name: ticketChannelName+'-'+formattedId,
                    type: ChannelType.GuildText,
                    parent: categoryId,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: ['ViewChannel'],
                        },
                        {
                            id: interaction.user.id,
                            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
                        },
                        {
                            id: board.roleId,
                            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
                        },
                        {
                            id: process.env.ENV === 'PROD' ? process.env.BOT_PROD_ID : process.env.BOT_DEV_ID,
                            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageMessages', 'ManageChannels']
                        }
                    ],
                })
                    .then(channel => {
                        let title = board.ticketTitle;
                        let content = board.ticketContent;
                        content = content.replace('%SENDER%', `<@${interaction.user.id}>`);
                        content = content.replace('%ROLE%', `<@&${board.roleId}>`);
                        const embed = new EmbedBuilder()
                            .setTitle(title)
                            .setDescription(content)
                        ;

                        const userId = interaction.user.id;
                        const mentionMessage = `<@${userId}>`;

                        const close = new ButtonBuilder()
                            .setCustomId('closeticket')
                            .setLabel(ticketClose)
                            .setEmoji('🔒')
                            .setStyle(ButtonStyle.Danger)
                        ;

                        const row = new ActionRowBuilder()
                            .addComponents(close);

                        channel.send({
                            content: mentionMessage ,
                            embeds: [embed],
                            components: [row],
                        }).then(message => {
                            let createTicket = new Ticket({ id: message.id, channelId: channel.id, ownerId: interaction.user.id, viewerId: board.roleId, state: 'open', startDate: Date.now(), formattedId: formattedId, guildId: guildId, boardId: board.id });
                            createTicket.save().then(t => console.log(`New ticket : ${t.id}`));
                        });

                        board.nextId += 1;
                        board.save();

                        interaction.deferUpdate();
                    })
            } else {
                console.log("Create ticket error: No board");
                return;
            }
        });

    }
}
