const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, SelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { Board } = require('../../models/index');
const {StreamLine, Guild, StreamBoard} = require("../../models");

module.exports = {
    name: 'delStreamer',
    run: async (client, interaction) => {
        const selectedStreamerId = interaction.values[0];
        const guildId = interaction.guild.id;
        let channelId = interaction.channel.id;

        StreamLine.findOneAndRemove({guildId: guildId, channelId: channelId, userId: selectedStreamerId}, async function (err, count) {
            const answer = await trans(guildId, "streamer_removed");
            interaction.reply({ content: answer, ephemeral: true });

        });
    }
}
