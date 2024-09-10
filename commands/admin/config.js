const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const {StreamBoard, StreamLine, Guild} = require("../../models");

module.exports = {
    name: 'config',
    permissions: ['ADMINISTRATOR'],
    description: 'Get the configuration of the bot',
    runSlash: async (client, interaction) => {
        const guildId = interaction.guild.id;
        let channels = interaction.guild.channels.cache;

        let description =  '';

        // Get all global info
        description += '🛠️ __**Global**__\n\n';
        let guild = await Guild.findOne({id: guildId});

        description += '- Language: ' + guild.lg + '\n';
        description += '- Challenger roles: ' + (guild.challengerSetRoles ? 'enabled' : 'disabled') + '\n';
        let channel = channels.get(guild.logChannel);
        description += '- Log channel: ' + (channel ? '<#' + guild.logChannel + '>' : 'none') + '\n';

        // Get all stream boards
        description += '\n🔴 __**Streamer boards**__\n\n';
        let boards = await StreamBoard.find({guildId: guildId})

        for (let board of boards) {
            description += 'Streamers for ' + (board.channelId ? ('<#' + board.channelId + '>') : 'unknown channel') + '\n';

            const streamers = await StreamLine.find({ guildId: guildId, channelId: board.channelId });

            for (let streamer of streamers) {
                description += `- <@${streamer.userId}>\n`;
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('Config')
            .setDescription(description);

        interaction.reply({ embeds: [embed], ephemeral: true})

    }
}
