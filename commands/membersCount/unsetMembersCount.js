const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, StringSelectMenuBuilder, ActionRowBuilder} = require("discord.js");
const { Guild } = require('../../models/index');
const { trans } = require('../../utils/Translator.js');

module.exports = {
    name: 'unsetmemberscount',
    description: 'Unset a members counter channel',
    descriptionLocalizations: {
        fr: 'Supprime un salon de compteur de membres'
    },
    permissions: ['MANAGE_MESSAGES'],
    runSlash: async (client, interaction) => {
        const guildId = interaction.guild.id;
        const message = await trans(guildId, 'count_channel_removed');

        Guild.findOneAndUpdate( { id: interaction.guild.id }, { membersCountChannel: null }, function (err, weekCalendar) {
            interaction.reply({content: message, ephemeral: true});
        });
    }
}
