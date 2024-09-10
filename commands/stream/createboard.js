const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder, ChannelSelectMenuBuilder} = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const {getUri} = require("axios");
const {StreamBoard, ChallengerRank} = require("../../models");

module.exports = {
    name: 'addstreamboard',
    description: 'Add a new stream board',
    descriptionLocalizations: {
        fr: 'Ajoute un nouveau panel de stream',
    },
    permissions: ['MANAGE_MESSAGES'],
    runSlash: async (client, interaction) => {
        const guildId = interaction.guild.id;
        let channelId = interaction.channel.id;

        const embed = new EmbedBuilder()
            .setTitle(await trans(guildId, 'streamers_title'))

        let answer = await trans(guildId, 'board_created');

        interaction.channel.send({ embeds: [embed]})
            .then(sentMessage => {
                StreamBoard.countDocuments({guildId: guildId, channelId: channelId}, async function (err, count){
                    const guildId = interaction.channel.guildId;
                    if(count<=0){
                        let createBoard = new StreamBoard({ id: sentMessage.id, guildId: guildId, channelId: channelId });
                        createBoard.save().then(b => console.log(`New stream board : ${b.id}`));
                    } else {
                        StreamBoard.findOneAndUpdate( {  guildId: guildId, channelId: channelId }, {  id: sentMessage.id }, function (err, rank) {
                            interaction.reply({content: answer, ephemeral: true});
                        });
                    }
                    interaction.reply({ content: answer, ephemeral: true });
                });
            })
            .catch(console.error);

    }
}
