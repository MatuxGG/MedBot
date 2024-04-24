const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { Ticket } = require('../../models/index');
const { ChannelType } = require('discord.js');

module.exports = {
    name: 'removeticket',
    run: async (client, interaction) => {
        const guildId = interaction.guild.id;

        Ticket.findOne({ channelId: interaction.channel.id }, async function (err, ticket) {
            if (err) {
                console.log(`Remove ticket error: ${err}`);
                return;
            }

            if (ticket) {
                if (ticket.state === 'open') {
                    interaction.reply({content: await trans(guildId, 'ticket_no_remove'), ephemeral: true})
                    return;
                }

                ticket.remove();
                interaction.channel.delete();
            } else {
                console.log("Remove ticket error: No ticket");
                return;
            }

        });
    }
}
