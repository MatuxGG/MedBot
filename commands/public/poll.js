const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'poll',
    description: 'Make a poll',
    descriptionLocalizations: {
        fr: 'Créer un sondage'
    },
    permissions: [],
    options: [
        {
            name: 'title',
            nameLocalizations: {
                fr: 'titre'
            },
            description: 'Enter the title of your poll',
            descriptionLocalizations: {
                fr: 'Entre un titre pour ton sondage'
            },
            type: ApplicationCommandOptionType.String,
            required: 'true',
        },
        {
            name: 'content',
            nameLocalizations: {
                fr: 'contenu'
            },
            description: 'Enter the content of your poll',
            descriptionLocalizations: {
                fr: 'Entre le contenu de ton sondage'
            },
            type: ApplicationCommandOptionType.String,
            required: 'true',
        },
        {
            name: 'reactions',
            nameLocalizations: {
                fr: 'réactions'
            },
            description: 'Choose the reaction set to use',
            descriptionLocalizations: {
                fr: 'Choisis les réactions à utiliser'
            },
            type: ApplicationCommandOptionType.Number,
            required: 'true',
            choices: [
                {
                    name: '✅❎',
                    value: 1
                },
                {
                    name: '👍👎',
                    value: 2
                },
                {
                    name: '🙂😦',
                    value: 3
                }
            ]
        },
    ],
    async runSlash(client, interaction) {
        const pollTitle = interaction.options.getString('title');
        const pollContent = interaction.options.getString('content');
        const pollReactions = interaction.options.getNumber('reactions');

        const embed = new EmbedBuilder()
            .setTitle(pollTitle)
            .setColor('#00a3b5')
            .setDescription(pollContent)
            .setTimestamp();

        const poll = await interaction.reply({ embeds: [embed], fetchReply: true });
        switch (pollReactions) {
            case 1:
                poll.react('✅');
                poll.react('❎');
                break;
            case 2:
                poll.react('👍');
                poll.react('👎');
                break;
            case 3:
                poll.react('🙂');
                poll.react('😦');
                break;
        }
    }
}
