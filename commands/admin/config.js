const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const {StreamBoard, StreamLine, Guild, Board, Ticket, ChanToClean, WeekCalendar, ChallengerBoard, ChallengerRank} = require("../../models");
const { EMOJIS } = require('../../config');

module.exports = {
    name: 'config',
    permissions: ['ADMINISTRATOR'],
    description: 'Get the configuration of the bot (english only)',
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

        // Get all channels to clean
        description += '\n🧹 __**Channels to clean**__\n\n';
        let ctc = await ChanToClean.find({guildId: guildId})

        for (let chan of ctc) {
            description += '- <#' + chan.id + '> - '+chan.hours + ':' + chan.minutes +' UTC\n';
        }

        // Get all week calendars
        description += '\n📅 __**Weekly calendars**__\n\n';
        let calendars = await WeekCalendar.find({guildId: guildId})

        let i = 0;
        for (let calendar of calendars) {
            description += 'Calendar #' + i + '\n';
            description += '- Time: ' + calendar.hours + ':' + calendar.minutes + ' UTC\n';
            let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let dayStr = days[calendar.day];
            description += '- Day: ' + dayStr + '\n';
            description += '- Custom title: ' + (calendar.title ? calendar.title : 'none' ) + '\n';
            i++;
            description += '\n';
        }
        if (calendars.length > 0)
            description = description.slice(0, -1);

        // Get all ticket boards
        description += '\n🎫 __**Ticket boards**__\n\n';
        let ticketBoards = await Board.find({guildId: guildId})

        for (let board of ticketBoards) {
            description += 'Tickets for <#' + board.id + '>\n';
            description += `- Title: ${board.ticketTitle}\n`;
            description += `- Content: ${board.ticketContent}\n`;
            description += `- Role: ${board.roleId ? '<@&' + board.roleId + '>' : 'none'}\n`;

            const tickets = await Ticket.find({ guildId: guildId, boardId: board.id });

            let open = 0;
            let close = 0;
            for (let ticket of tickets) {
                if (ticket.state === 'open') {
                    open++;
                } else {
                    close++;
                }
            }
            description += `- Opened: ${open}\n`;
            description += `- Closed: ${close}\n`;
            description += '\n';
        }
        if (ticketBoards.length > 0)
            description = description.slice(0, -1);

        // Get all stream boards
        description += '\n🔴 __**Streamer boards**__\n\n';
        let boards = await StreamBoard.find({guildId: guildId})

        for (let board of boards) {
            description += 'Streamers for ' + (board.channelId ? ('<#' + board.channelId + '>') : 'unknown channel') + '\n';

            const streamers = await StreamLine.find({ guildId: guildId, channelId: board.channelId });

            for (let streamer of streamers) {
                description += `- <@${streamer.userId}>\n`;
            }
            description += '\n';
        }
        if (boards.length > 0)
            description = description.slice(0, -1);

        // Get all challenger boards
        description += '\n🏆 __**Challenger boards**__\n\n';
        let challengerBoards = await ChallengerBoard.find({guildId: guildId})

        for (let board of challengerBoards) {
            description += '- Board in <#' + board.channelId + '>\n';
        }

        // Get all challenger ranks
        description += '\n🏆 __**Challenger ranks**__\n\n';
        let ranks = await ChallengerRank.find({guildId: guildId})

        for (let rank of ranks) {
            let role = EMOJIS[rank.id].split('_')[1].split(':')[0];
            description += '- ' + role + ': <@&' + rank.roleId + '>\n';
        }

        const embed = new EmbedBuilder()
            .setTitle('Config')
            .setDescription(description);

        interaction.reply({ embeds: [embed], ephemeral: true})

    }
}
