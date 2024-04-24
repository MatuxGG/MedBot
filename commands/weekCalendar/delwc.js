const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { WeekCalendar } = require('../../models/index');
const { trans } = require('../../utils/Translator.js');

module.exports = {
    name: 'delwc',
    description: 'Remove a weekly calendar for a channel',
    descriptionLocalizations: {
        fr: 'Supprime le calendrier quotidien envoyé dans ce salon'
    },
    permissions: ['MANAGE_GUILD'],
    runSlash: async (client, interaction) => {
        const guildId = interaction.channel.guildId;
        const obj = await trans(guildId, "Weekly Calendar");
        const reply = await trans(guildId, "removed_success",{obj: obj} );
        WeekCalendar.findOneAndRemove( { id: interaction.channel.id }, function (err, weekCalendar) {
            interaction.reply({ content: reply, ephemereal: true}); 
	        console.log(`Removed channel for weekly calendar: ${interaction.channel.id}`);
        });
    }
}
