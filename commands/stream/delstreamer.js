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
    runSlash: async (client, interaction) => {
        const guildId = interaction.guild.id;
        let channelId = interaction.channel.id;

        let streamers = await StreamLine.find({guildId: guildId, channelId: channelId});

        if (streamers.length <= 0) {
            interaction.reply({ content: await trans(guildId, "no_streamer"), ephemeral: true });
        } else {
            const members = streamers.map(streamer => ({
                label: client.users.cache.get(streamer.userId).username,
                value: streamer.userId
            }));

            const userSelectMenu = new StringSelectMenuBuilder()
                .setCustomId('delStreamer')
                .addOptions(members);

            const actionRow = new ActionRowBuilder()
                .addComponents(userSelectMenu);

            await interaction.reply({ content: await trans(guildId, 'streamer_select'), components: [actionRow], ephemeral: true });

        }
    }
}
