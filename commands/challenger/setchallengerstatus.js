const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder, ChannelSelectMenuBuilder} = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const {getLeaderboardData} = require("../../utils/challenger/leaderboardUtils");
const { ChallengerBoard } = require("../../models/index");
const { EMOJIS } = require('../../config');
const {ChanToClean, ChallengerRank, Guild} = require("../../models");

module.exports = {
    name: 'setchallengerstatus',
    description: 'Enable or disable Challenger roles automatically set',
    descriptionLocalizations: {
        fr: 'Active ou désactive l\'attribution de roles Challenger automatiques',
    },
    options: [
        {
            name: 'enabled',
            description: 'Enabled',
            descriptionLocalizations: {
                fr: 'Activé'
            },
            type: ApplicationCommandOptionType.Boolean,
            required: 'true',
            choices: [
                {
                    name: 'Enabled',
                    nameLocalizations: {
                        fr: 'Activé'
                    },
                    value: true
                },
                {
                    name: 'Disabled',
                    nameLocalizations: {
                        fr: 'Désactivé'
                    },
                    value: false
                },
            ]
        }
    ],
    permissions: ['MANAGE_MESSAGES'],
    runSlash: async (client, interaction) => {
        let guildId = interaction.guild.id;
        let newEnabled = interaction.options.getBoolean('enabled');

        Guild.findOneAndUpdate( { id: guildId }, {challengerSetRoles: newEnabled }, async function (err, guild) {
            const obj = await trans(guildId, "Challenger status");
            const reply = await trans(guildId, "updated_success", {obj: obj} );
            interaction.reply({content: reply, ephemereal: true});
        });
    }
}
