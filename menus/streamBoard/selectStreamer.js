const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, SelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { Board } = require('../../models/index');
const {StreamLine, Guild, StreamBoard} = require("../../models");

module.exports = {
    name: 'selectStreamer',
    run: async (client, interaction) => {
        const selectedStreamerId = interaction.values[0];
        const guildId = interaction.guild.id;
        let channelId = interaction.channel.id;

        StreamLine.countDocuments({guildId: guildId, channelId: channelId, userId: selectedStreamerId}, async function (err, count){
            const answer = await trans(guildId, "streamer_added");
            if(count<=0){
                let createStreamer = new StreamLine({ guildId: guildId, channelId: channelId, userId: selectedStreamerId });
                createStreamer.save().then(b => console.log(`New streamer : ${b.id}`));
            }
            interaction.reply({ content: answer, ephemeral: true });
        });
    }
}
