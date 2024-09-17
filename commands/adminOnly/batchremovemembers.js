const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'batchremovemembers',
    permissions: ['ADMINISTRATOR'],
    description: 'Delete ALL members',
    descriptionLocalizations: {
        fr: 'Supprimer TOUS les membres',
    },
    options: [
        {
            name: 'confirm',
            nameLocalizations: {
                fr: 'confirmer'
            },
            description: 'Confirm that you wanna do this',
            descriptionLocalizations: {
                fr: 'Confirmer que vous voulez faire ça',
            },
            type: ApplicationCommandOptionType.String,
            required: 'true',
            choices: [
                {
                    name: 'Cancel',
                    nameLocalizations: {
                        fr: 'Annuler',
                    },
                    value: 'no'
                },
                {
                    name: 'Confirm',
                    nameLocalizations: {
                        fr: 'Confirmer',
                    },
                    value: 'yes'
                },
            ]
        }
    ],
    runSlash: (client, interaction) => {
        let confirm = interaction.options.getString('confirm');
        if (confirm === 'no') {
            interaction.reply({ content: 'Batch delete canceled', ephemeral: true })
            return;
        }

        const guild = interaction.guild;
        const exemptMemberId = interaction.user.id;

        guild.members.fetch().then(members => {
            members.forEach(member => {
                if (member.id !== exemptMemberId) {
                    member.kick()
                        .then(() => console.log(`Membre expulsé : ${member.displayName}`))
                        .catch(console.error); // Gestion des erreurs
                }
            });
        }).catch(console.error);

        interaction.reply({ content: 'Batch delete terminated', ephemeral: true })
    }
}
