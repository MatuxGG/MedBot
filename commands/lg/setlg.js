const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { Guild } = require('../../models/index');
const { trans } = require('../../utils/Translator.js');

module.exports = {
    name: 'setlg',
    description: 'Set language for this server',
    descriptionLocalizations: {
        fr: 'Choisis la langue utilisée sur ce serveur'
    },
    permissions: ['MANAGE_MESSAGES'],
    options: [
        {
            name: 'lg',
            description: 'Language',
            descriptionLocalizations: {
                fr: 'langue'
            },
            type: ApplicationCommandOptionType.String,
            required: 'true',
            choices: [
                {
                    name: 'English',
                    value: 'en'
                },
                {
                    name: 'Français',
                    value: 'fr'
                },
            ]
	}
    ],
    runSlash: async (client, interaction) => {
        let newLg = interaction.options.getString('lg');
        const guildId = interaction.channel.guildId;
         Guild.findOneAndUpdate( { id: guildId }, {lg: newLg }, async function (err, chanToClean) {
             const obj = await trans(guildId, "Language");
             const reply = await trans(guildId, "updated_success", {obj: obj} );
             interaction.reply({content: reply, ephemeral: true});
         });
    }
}
