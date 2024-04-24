const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { Guild } = require('../../models/index');
const { trans } = require('../../utils/Translator.js');

module.exports = {
    name: 'getlg',
    description: 'Get language for this server',
    descriptionLocalizations: {
        fr: 'Affiche la langue utilisée pour ce serveur'
    },
    permissions: ['MANAGE_MESSAGES'],
    runSlash: (client, interaction) => {
        let guildId = interaction.channel.guildId;
        Guild.findOne({ id: guildId }, async function (err, guild) {
            if (err) {
                console.log(`Language error: ${err}`);
                return;
            }
    
            if (guild) {
                const lg = guild.lg ? guild.lg : 'en';

                let lgDisplay = "English";
                if (lg == "fr"){
                    lgDisplay = "Français";
                }

                let flagUrl = "https://goodloss.fr/build/images/flags/" + lg + ".png";

                const title = await trans(guildId, "Language");

                const embed = new EmbedBuilder()
                    .setTitle(title)
                    //.setImage(client.user.displayAvatarURL())
                    .setURL('https://goodloss.fr')
                    .setThumbnail(flagUrl)
                    .addFields(
                        {name : title, value : lgDisplay, inline : false}
                    )
                    .setTimestamp()
                    .setFooter(
                        {text : interaction.user.username, iconURL : interaction.user.displayAvatarURL()}
                    )
    
                interaction.reply({ embeds: [embed] })
            } else {
                console.log("Language error: No language");
                return;
            } 
        });
    }
}
