const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const {trans} = require("../../utils/Translator");

module.exports = {
    name: 'clear',
    description: 'Mass delete command',
    descriptionLocalizations: {
        fr: 'Commande de suppression de masse'
    },
    permissions: ['MANAGE_MESSAGES'],
    options: [
        {
            name: 'amount',
            nameLocalizations: {
                fr: 'quantité'
            },
            description: 'Amount of messages',
            descriptionLocalizations: {
                fr: 'Quantité de messages'
            },
            type: ApplicationCommandOptionType.Number,
            required: 'true',
	}
    ],
    runSlash: async (client, interaction) => {
        const guildId = interaction.guild.id;
        const clearFinished = await trans(guildId, 'clear_finished');

        let amount = interaction.options.getNumber('amount');
        amount = amount <= 0 || amount > 100 ? 100 : amount;
        let chan = interaction.channel;

        chan.messages.fetch({ limit: amount }).then(messages => {
            // Filtrer les messages non épinglés et limiter à 'amount'
            const messagesToDelete = messages.filter(m => !m.pinned).first(amount);

            // Créer un tableau de promesses de suppression
            const deletePromises = messagesToDelete.map(message => message.delete());

            // Attendre que toutes les suppressions soient terminées
            Promise.all(deletePromises)
                .then(() => {
                    interaction.reply({ content: clearFinished, ephemeral: true });
                })
                .catch(error => {
                    interaction.reply({ content: 'Error during messages cleanup', ephemeral: true });
                });
        });
    }
}
