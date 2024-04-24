const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder, ChannelSelectMenuBuilder} = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const {getLeaderboardData} = require("../../utils/challenger/leaderboardUtils");
const { ChallengerBoard } = require("../../models/index");
const { EMOJIS } = require('../../config');

module.exports = {
    name: 'addchallengerboard',
    description: 'Add a new Challenger board',
    descriptionLocalizations: {
        fr: 'Ajoute un nouveau classement Challenger',
    },
    permissions: ['MANAGE_MESSAGES'],
    runSlash: async (client, interaction) => {
        let guildId = interaction.guild.id;
        const data = await getLeaderboardData(0);
        const embed = new EmbedBuilder()
            .setTitle(await trans(guildId, 'leaderboard'))
            .setImage('https://orianagames.com/build/images/Challenger.ico')
            .setURL('https://orianagames.com/challenger/')
            .setDescription(
                data.map((currElement, index) => "**__#" + (parseInt(index) + 1) + "__** [" + EMOJIS[data[index].rankId] + "**" + data[index].rankName + "** `(" + data[index].rankPercent + "%)`] - **[" + data[index].user + "](https://orianagames.com/player/" + data[index].user + ")**").join("\n")
            )

        interaction.reply({ content: await trans(guildId, "leaderboard_sent"), ephemeral: true });

        interaction.channel.send({ embeds: [embed] }).then(msg => {
            const createBoard = new ChallengerBoard({ id: msg.id, channelId: msg.channel.id, guildId: guildId });
            createBoard.save().then(g => console.log(`New challenger board : ${g.id}`));
        });

    }
}
