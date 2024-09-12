const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder, ChannelSelectMenuBuilder} = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const {getUri} = require("axios");
const {StreamBoard, ChallengerRank} = require("../../models");

module.exports = {
    name: 'addstreamer',
    description: 'Add a new streamer to this channel board',
    descriptionLocalizations: {
        fr: 'Ajoute un nouveau streamer au panel de ce salon',
    },
    permissions: ['MANAGE_MESSAGES'],
    runSlash: async (client, interaction) => {
        const guildId = interaction.guild.id;
        let channelId = interaction.channel.id;
        interaction.guild.members.fetch().then(async (members) => {
            StreamBoard.countDocuments({guildId: guildId, channelId: channelId}, async function (err, count){
                const guildId = interaction.guild.id;
                if(count<=0){
                    interaction.reply({ content: await trans(guildId, "no_stream_board"), ephemeral: true });
                } else {
                    const members = interaction.guild.members.cache
                        .filter(member => member.user && member.user.displayName && member.user.id) // Filtre les membres invalides
                        .map(member => ({
                            label: member.user.displayName,
                            value: member.user.id
                        }));

                    const userSelectMenu = new StringSelectMenuBuilder()
                        .setCustomId('selectStreamer')
                        .addOptions(members);

                    const actionRow = new ActionRowBuilder()
                        .addComponents(userSelectMenu);

                    await interaction.reply({ content: await trans(guildId, 'streamer_select'), components: [actionRow], ephemeral: true });

                }
            });
        });
    }
}
