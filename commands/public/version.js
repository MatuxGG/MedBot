const { EmbedBuilder } = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const { VERSION } = require('../../config');

module.exports = {
    name: 'version',
    description: 'Get MedBot version',
    descriptionLocalizations: {
        fr: 'Affiche la version de MedBot'
    },
    permissions: [],
    runSlash: async (client, interaction) => {
        
        const version = VERSION;
        const guildId = interaction.channel.guildId;

        const versionTrans = await trans(guildId, 'version');

        const embed = new EmbedBuilder()
            .setTitle('Version')
            //.setImage(client.user.displayAvatarURL())
            .setURL('https://'+process.env.HOST_URL)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {name : versionTrans, value : `${version}`, inline : false},
            )
            .setTimestamp()
            .setFooter(
                {text : interaction.user.username, iconURL : interaction.user.displayAvatarURL()}
            )

        interaction.reply({ embeds: [embed], ephemeral: true })
    }
}
