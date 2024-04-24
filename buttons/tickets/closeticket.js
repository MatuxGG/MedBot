const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { Board } = require('../../models/index');
const { ChannelType } = require('discord.js');
const {Ticket} = require("../../models");

module.exports = {
    name: 'closeticket',
    run: async (client, interaction) => {
        let channelId = interaction.channel.id;
        let guildId = interaction.guild.id;
        let ticketChannelName = await trans(guildId, 'ticket_close_channel_name');
        Ticket.findOne({ channelId: channelId }, async function (err, ticket) {
            if (err) {
                console.log(`Close ticket error: ${err}`);
                return;
            }

            if (ticket) {
                if (ticket.state === 'close') {
                    interaction.reply({content: 'Ticket already closed', ephemeral: true})
                    return;
                }

                if (interaction.channel.name !== ticketChannelName+'-'+ticket.formattedId) {
                    await interaction.channel.setName(ticketChannelName+'-'+ticket.formattedId);
                }
                await interaction.channel.permissionOverwrites.set([
                    {
                        id: interaction.guild.id,
                        deny: ['ViewChannel'],
                    },
                    {
                        id: ticket.ownerId,
                        deny: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
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

                let description = await trans(guildId, 'ticket_closed_by');
                description = description.replace('%SENDER%', `<@${interaction.user.id}>`);

                const embed = new EmbedBuilder()
                    .setDescription(description);

                const transcript = new ButtonBuilder()
                    .setCustomId('saveticket')
                    .setLabel(await trans(guildId, 'ticket_save'))
                    .setEmoji('💾')
                    .setStyle(ButtonStyle.Success)
                ;

                const reopen = new ButtonBuilder()
                    .setCustomId('reopenticket')
                    .setLabel(await trans(guildId,'ticket_reopen'))
                    .setEmoji('🔓')
                    .setStyle(ButtonStyle.Primary)
                ;

                const remove = new ButtonBuilder()
                    .setCustomId('removeticket')
                    .setLabel(await trans(guildId, 'ticket_remove'))
                    .setEmoji('⛔')
                    .setStyle(ButtonStyle.Danger)
                ;

                const row = new ActionRowBuilder()
                    .addComponents(transcript, reopen, remove);

                interaction.channel.send({ embeds: [embed], components: [row]})

                ticket.state = 'close';
                ticket.save();

                interaction.deferUpdate();
            } else {
                console.log("Close ticket error: No ticket");
                return;
            }
        });
    }
}
