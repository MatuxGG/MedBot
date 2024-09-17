const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'batchremovemembers',
    permissions: ['ADMINISTRATOR'],
    description: 'Delete ALL members',
    options: [
        {
            name: 'confirm',
            description: 'Confirm that you wanna do this',
            type: ApplicationCommandOptionType.String,
            required: 'true',
            choices: [
                {
                    name: 'Cancel',
                    value: 'no'
                },
                {
                    name: 'Confirm',
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
