const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'say',
    description: 'Make me say something',
    descriptionLocalizations: {
        fr: 'Fait moi dire quelque chose'
    },
    permissions: [],
    options: [
        {
            name: 'text',
            nameLocalizations: {
                fr: 'texte'
            },
            description: 'Enter the text you want me to say',
            descriptionLocalizations: {
                fr: 'Entre un texte que tu veux que je dise'
            },
            type: ApplicationCommandOptionType.String,
            required: 'true',
        }
    ],
    async runSlash(client, interaction) {
        const text = interaction.options.getString('text');
        interaction.reply({content: text, ephemeral: false});
    }
}
