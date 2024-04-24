const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: 'send',
    permissions: ['ADMINISTRATOR'],
    description: 'Send an event',
    options: [
        {
            name: 'event',
            description: 'Choose an event to send',
            type: ApplicationCommandOptionType.String,
            required: 'true',
            choices: [
                {
                    name: 'guildMemberAdd',
                    value: 'guildMemberAdd'
                },
                {
                    name: 'guildMemberRemove',
                    value: 'guildMemberRemove'
                },
                {
                    name: 'guildCreate',
                    value: 'guildCreate'
                }
            ]
        }
    ],
    runSlash: (client, interaction) => {
        if (interaction.user.id != '240577436557770752') return;
        const eventChoices = interaction.options.getString('event');
        if (eventChoices == 'guildMemberAdd') {
            client.emit('guildMemberAdd', interaction.member);
            interaction.reply( { content: 'Event guildMemberAdd sent!', ephemereal: true }); 
        } else if (eventChoices == 'guildCreate') {
            client.emit('guildCreate', interaction.guild);
            interaction.reply({ content: 'Event guildCreate sent!', ephemereal: true }); 
        } else {
            client.emit('guildMemberRemove', interaction.member);
            interaction.reply( { content: 'Event guildMemberRemove sent!', ephemereal: true }); 

        }
    }
}
