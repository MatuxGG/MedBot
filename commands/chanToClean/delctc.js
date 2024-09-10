const { EmbedBuilder } = require("discord.js");
const { ChanToClean } = require('../../models/index');
const { trans } = require('../../utils/Translator.js');


module.exports = {
    name: 'delctc',
    description: 'Remove a channel from clean up process',
    descriptionLocalizations: {
        fr: 'Supprime ce salon du processus de suppression quotidienne'
    },
    permissions: ['MANAGE_GUILD'],
    runSlash: async (client, interaction) => {
        const guildId = interaction.channel.guildId;
        const obj = await trans(guildId, "Channel to clean");
        const reply = await trans(guildId, 'removed_success', {obj: obj} );
        ChanToClean.findOneAndRemove( { id: interaction.channel.id }, function (err, chanToClean) {
            interaction.reply({ content: reply, ephemeral: true});
	        console.log(`Removed channel to clean : ${interaction.channel.id}`);
        });
    }
}
