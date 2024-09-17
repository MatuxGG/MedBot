const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder, ChannelSelectMenuBuilder} = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const {getUri} = require("axios");
const {StreamBoard, ChallengerRank, StreamLine} = require("../../models");

module.exports = {
    name: 'delstreamer',
    description: 'Remove a streamer of this channel board',
    descriptionLocalizations: {
        fr: 'Supprime un streamer au panel de ce salon',
    },
    permissions: ['MANAGE_MESSAGES'],
    options: [
        {
            name: 'streamer',
            nameLocalizations: {
                fr: 'streamer',
            },
            description: 'Name of the streamer to remove',
            descriptionLocalizations: {
                fr: 'Nom du streamer à supprimer',
            },
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    runSlash: async (client, interaction) => {
        let selectedStreamer = interaction.options.getString('streamer');
        let selectedStreamerId = selectedStreamer.replace("<@", "").replace(">", "");
        let user = await client.users.fetch(selectedStreamerId);
        if (!user) {
            interaction.reply({ content: await trans(guildId, "no_streamer"), ephemeral: true });
            return;
        }
        const guildId = interaction.guild.id;
        let channelId = interaction.channel.id;

        let streamer = await StreamLine.findOne({guildId: guildId, channelId: channelId, userId: selectedStreamerId});

        if (streamer === null) {
            interaction.reply({ content: await trans(guildId, "no_streamer"), ephemeral: true });
        } else {
            StreamLine.findOneAndRemove({guildId: guildId, channelId: channelId, userId: selectedStreamerId}, async function (err, count) {
                const answer = await trans(guildId, "streamer_removed");
                interaction.reply({ content: answer, ephemeral: true });

            });
        }
    }
}
