const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder, ChannelSelectMenuBuilder} = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const {getLeaderboardData} = require("../../utils/challenger/leaderboardUtils");
const { ChallengerBoard } = require("../../models/index");
const { EMOJIS } = require('../../config');
const {ChanToClean, ChallengerRank} = require("../../models");

module.exports = {
    name: 'setchallengerrank',
    description: 'Set a Challenger rank',
    descriptionLocalizations: {
        fr: 'Met à jour un rang Challenger',
    },
    options: [
        {
            name: 'name',
            description: 'Name',
            descriptionLocalizations: {
                fr: 'Nom'
            },
            type: ApplicationCommandOptionType.String,
            required: 'true',
            choices: [
                {
                    name: 'Unranked',
                    nameLocalizations: {
                        fr: 'Non classé'
                    },
                    value: '0'
                },
                {
                    name: 'Bronze 3',
                    value: '1'
                },
                {
                    name: 'Bronze 2',
                    value: '2'
                },
                {
                    name: 'Bronze 1',
                    value: '3'
                },
                {
                    name: 'Silver 3',
                    value: '4'
                },
                {
                    name: 'Silver 2',
                    value: '5'
                },
                {
                    name: 'Silver 1',
                    value: '6'
                },
                {
                    name: 'Gold 3',
                    value: '7'
                },
                {
                    name: 'Gold 2',
                    value: '8'
                },
                {
                    name: 'Gold 1',
                    value: '9'
                },
                {
                    name: 'Crystal 3',
                    value: '10'
                },
                {
                    name: 'Crystal 2',
                    value: '11'
                },
                {
                    name: 'Crystal 1',
                    value: '12'
                },
                {
                    name: 'Master',
                    value: '13'
                },

                {
                    name: 'Epic',
                    value: '14'
                },
            ]
        },
        {
            name: 'role',
            description: 'Role',
            type: ApplicationCommandOptionType.Role,
            required: 'true',
        }
    ],
    permissions: ['MANAGE_MESSAGES'],
    runSlash: async (client, interaction) => {
        let guildId = interaction.guild.id;
        let newName = interaction.options.getString('name');
        let newRole = interaction.options.getRole('role');
        let newRoleId = newRole.id;

        ChallengerRank.countDocuments({id: newName, guildId: guildId}, async function (err, count){
            const guildId = interaction.channel.guildId;
            const obj = await trans(guildId, "Challenger Rank");
            if(count<=0){
                const createRank = new ChallengerRank({ id: newName, roleId: newRoleId, guildId: guildId });
                createRank.save().then(c => console.log(`New rank : ${c.id}`));
                const reply = await trans(guildId, 'added_success', { obj: obj } );
                interaction.reply({content:  reply, ephemeral: true});
            } else {
                const reply = await trans(guildId, 'updated_success', { obj:obj } );
                ChallengerRank.findOneAndUpdate( { id: newName, guildId: guildId }, { roleId: newRoleId }, function (err, rank) {
                    interaction.reply({content: reply, ephemeral: true});
                });
            }
        });
    }
}
