const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { Board, Ticket } = require('../../models/index');
const { ChannelType } = require('discord.js');

module.exports = {
    name: 'reopenticket',
    run: async (client, interaction) => {
        const guildId = interaction.guild.id;
        Ticket.findOne({ channelId: interaction.channel.id }, async function (err, ticket) {
            if (ticket.state === 'open') {
                interaction.reply({content: await trans(guildId, 'ticket_no_open'), ephemeral: true})
                return;
            }

            const mentionMessage = `<@${ticket.ownerId}>`;

            let description = await trans(guildId, 'ticket_reopen_by');
            description = description.replace('%SENDER%', `<@${interaction.user.id}>`);

            const embed = new EmbedBuilder()
                .setDescription(description);

            const close = new ButtonBuilder()
                .setCustomId('closeticket')
                .setLabel(await trans(guildId, 'ticket_close'))
                .setEmoji('🔒')
                .setStyle(ButtonStyle.Danger)
            ;

            const row = new ActionRowBuilder()
                .addComponents(close);

            await interaction.channel.permissionOverwrites.set([
                {
                    id: interaction.guild.id,
                    allow: ['ViewChannel'],
                },
                {
                    id: ticket.ownerId,
                    allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
                },
                {
                    id: ticket.viewerId,
                    allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
                },
                {
                    id: process.env.ENV === 'PROD' ? process.env.BOT_PROD_ID : process.env.BOT_DEV_ID,
                    allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageMessages', 'ManageChannels']
                }
            ])

            interaction.channel.send({
                content: mentionMessage ,
                embeds: [embed],
                components: [row],
            });

            ticket.state = 'open';
            ticket.save();

            interaction.deferUpdate();
        });

    }
}
