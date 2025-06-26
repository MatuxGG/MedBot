const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { Board, Ticket } = require('../../models/index');
const { ChannelType } = require('discord.js');
const {Guild} = require("../../models");
const discordTranscripts = require('discord-html-transcripts');

module.exports = {
    name: 'saveticket',
    run: async (client, interaction) => {
        const guildId = interaction.guild.id;
        const channel = await Guild.findOne( { id: interaction.guild.id });
        const transcriptChannelId = channel.transcriptChannel;
        if (!transcriptChannelId) {
            interaction.reply({content: await trans(guildId, 'no_transcript_channel'), ephemeral: true});
            return;
        }

        const attachment = await discordTranscripts.createTranscript(interaction.channel, {
            saveImages: true,
            filename: `transcript-${interaction.channel.name}.html`,
            poweredBy: false,
        });

        let description = await trans(guildId, 'ticket_saved_by');
        description = description.replace('%SENDER%', `<@${interaction.user.id}>`);

        client.channels.fetch(transcriptChannelId)
            .then(channel => {
                channel.send({
                    files: [attachment],
                });
            })
            .catch(error => {
                console.error("Quelque chose s'est mal passé lors de la récupération du salon :", error);
            });

        const embed = new EmbedBuilder()
            .setDescription(description);

        interaction.channel.send({ embeds: [embed]})

        interaction.deferUpdate();
    }
}
