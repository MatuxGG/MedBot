const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder, ChannelSelectMenuBuilder} = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const {getUri} = require("axios");
const {StreamBoard, ChallengerRank, StreamLine} = require("../../models");

module.exports = {
    name: 'addstreamer',
    description: 'Add a new streamer to this channel board',
    descriptionLocalizations: {
        fr: 'Ajoute un nouveau streamer au panel de ce salon',
    },
    permissions: ['MANAGE_MESSAGES'],
    options: [
        {
            name: 'streamer',
            nameLocalizations: {
                fr: 'streamer',
            },
            description: 'Name of the streamer to add',
            descriptionLocalizations: {
                fr: 'Nom du streamer à ajouter',
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
        StreamBoard.countDocuments({guildId: guildId, channelId: channelId}, async function (err, count){
            const guildId = interaction.guild.id;
            if(count<=0){
                interaction.reply({ content: await trans(guildId, "no_stream_board"), ephemeral: true });
            } else {
                StreamLine.countDocuments({guildId: guildId, channelId: channelId, userId: selectedStreamerId}, async function (err, count){
                    const answer = await trans(guildId, "streamer_added");
                    if(count<=0){
                        let createStreamer = new StreamLine({ guildId: guildId, channelId: channelId, userId: selectedStreamerId });
                        createStreamer.save().then(b => console.log(`New streamer : ${user.id}`));
                    }
                    interaction.reply({ content: answer, ephemeral: true });
                });
            }
        });
    }
}
