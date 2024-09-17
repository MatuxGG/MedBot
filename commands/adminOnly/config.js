const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const {StreamBoard, StreamLine, Guild, Board, Ticket, ChanToClean, WeekCalendar, ChallengerBoard, ChallengerRank} = require("../../models");
const { EMOJIS } = require('../../config');
const {trans} = require("../../utils/Translator");

module.exports = {
    name: 'config',
    permissions: ['ADMINISTRATOR'],
    description: 'Get the configuration of the bot (english only)',
    runSlash: async (client, interaction) => {
        const guildId = interaction.guild.id;
        let channels = interaction.guild.channels.cache;

        let guild = await Guild.findOne({id: guildId});
        if (!guild) {
            console.log("Config error: No guild");
            return;
        }

        let description =  '';

        // Récupérer toutes les informations globales
        description += '🛠️ __**' + await trans(guildId, 'Global') + '**__\n\n';

        description += '- ' + await trans(guildId, 'Language') + ' : ' + guild.lg + '\n';
        description += '- ' + await trans(guildId, 'Challenger roles') + ' : ' + (guild.challengerSetRoles ? await trans(guildId, 'enabled') : await trans(guildId, 'disabled')) + '\n';
        let channel = channels.get(guild.logChannel);
        description += '- ' + await trans(guildId, 'Log channel') + ' : ' + (channel ? '<#' + guild.logChannel + '>' : await trans(guildId, 'none')) + '\n';

        // Lien vers le salon de compte des membres (vocal)
        description += '- ' + await trans(guildId, 'Members count channel') + ' : ' + (guild.membersCountChannel ? '<#' + guild.membersCountChannel + '>' : await trans(guildId, 'none')) + '\n';

        // Récupérer tous les salons à nettoyer
        description += '\n🧹 __**' + await trans(guildId, 'Channels to clean') + '**__\n\n';
        let ctc = await ChanToClean.find({guildId: guildId});

        for (let chan of ctc) {
            description += '- <#' + chan.id + '> - ' + chan.hours + ':' + chan.minutes + ' UTC\n';
        }

        // Récupérer tous les calendriers hebdomadaires
        description += '\n📅 __**' + await trans(guildId, 'Weekly calendars') + '**__\n\n';
        let calendars = await WeekCalendar.find({guildId: guildId});

        let i = 0;
        for (let calendar of calendars) {
            description += await trans(guildId, 'Calendar') + ' #' + i + '\n';
            description += '- ' + await trans(guildId, 'Time') + ' : ' + calendar.hours + ':' + calendar.minutes + ' UTC\n';
            let days = [await trans(guildId, 'Sunday'), await trans(guildId, 'Monday'), await trans(guildId, 'Tuesday'), await trans(guildId, 'Wednesday'), await trans(guildId, 'Thursday'), await trans(guildId, 'Friday'), await trans(guildId, 'Saturday')];
            let dayStr = days[calendar.day];
            description += '- ' + await trans(guildId, 'Day') + ' : ' + dayStr + '\n';
            description += '- ' + await trans(guildId, 'Custom title') + ' : ' + (calendar.title ? calendar.title : await trans(guildId, 'none')) + '\n';
            i++;
            description += '\n';
        }
        if (calendars.length > 0)
            description = description.slice(0, -1);

        // Récupérer tous les panneaux de tickets
        description += '\n🎫 __**' + await trans(guildId, 'Ticket boards') + '**__\n\n';
        let ticketBoards = await Board.find({guildId: guildId});

        for (let board of ticketBoards) {
            description += await trans(guildId, 'Tickets for') + ' <#' + board.id + '>\n';
            description += `- ` + await trans(guildId, 'Title') + `: ${board.ticketTitle}\n`;
            description += `- ` + await trans(guildId, 'Content') + `: ${board.ticketContent}\n`;
            description += `- ` + await trans(guildId, 'Role') + `: ${board.roleId ? '<@&' + board.roleId + '>' : await trans(guildId, 'none')}\n`;

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
            description += `- ` + await trans(guildId, 'Opened') + `: ${open}\n`;
            description += `- ` + await trans(guildId, 'Closed') + `: ${close}\n`;
            description += '\n';
        }
        if (ticketBoards.length > 0)
            description = description.slice(0, -1);

        // Récupérer tous les panneaux de streamers
        description += '\n🔴 __**' + await trans(guildId, 'Streamer boards') + '**__\n\n';
        let boards = await StreamBoard.find({guildId: guildId});

        for (let board of boards) {
            description += await trans(guildId, 'Streamers for') + ' ' + (board.channelId ? ('<#' + board.channelId + '>') : await trans(guildId, 'unknown channel')) + '\n';

            const streamers = await StreamLine.find({ guildId: guildId, channelId: board.channelId });

            for (let streamer of streamers) {
                description += `- <@${streamer.userId}>\n`;
            }
            description += '\n';
        }
        if (boards.length > 0)
            description = description.slice(0, -1);

        // Récupérer tous les panneaux Challenger
        description += '\n🏆 __**' + await trans(guildId, 'Challenger boards') + '**__\n\n';
        let challengerBoards = await ChallengerBoard.find({guildId: guildId});

        for (let board of challengerBoards) {
            description += '- ' + await trans(guildId, 'Board in') + ' <#' + board.channelId + '>\n';
        }

        // Récupérer tous les rangs Challenger
        description += '\n🏆 __**' + await trans(guildId, 'Challenger ranks') + '**__\n\n';
        let ranks = await ChallengerRank.find({guildId: guildId});

        for (let rank of ranks) {
            let role = EMOJIS[rank.id].split('_')[1].split(':')[0];
            description += '- ' + role + ' : <@&' + rank.roleId + '>\n';
        }


        const embed = new EmbedBuilder()
            .setTitle(await trans(guild, 'Server configuration'))
            .setDescription(description);

        interaction.reply({ embeds: [embed], ephemeral: true})

    }
}
