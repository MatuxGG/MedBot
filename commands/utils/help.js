const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { trans } = require('../../utils/Translator.js');

module.exports = {
    name: 'help',
    description: 'Help command',
    descriptionLocalizations: {
        fr: 'Commande aide',
    },
    permissions: [],
    runSlash: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setTitle('Help')
            .setDescription('MedBot is the official multipurpose bot by Good Loss.\n' +
                'Click [here](<https://goodloss.fr/medbot>) to see all available features.');

        interaction.reply({ embeds: [embed], ephemeral: true})
    }
}
