const { ChanToClean, WeekCalendar } = require('../../models/index');
const { EmbedBuilder, ActivityType } = require("discord.js");
const dotenv = require('dotenv');
dotenv.config()
const { trans } = require('../../utils/Translator.js');
const { VERSION, EMOJIS} = require('../../config');
const { Guild } = require('../../models/index')
const {getPlayerData, getLeaderboardData} = require("../../utils/challenger/leaderboardUtils");
const {ChallengerRank, ChallengerBoard, StreamBoard, StreamLine} = require("../../models");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        setInterval(() => {
            const now = new Date();
            const day = now.getDay();
            const date = now.getDate();
            const hours = now.getUTCHours();
            const minutes = now.getUTCMinutes();

            // ChanToClean service
            ChanToClean.find({hours: hours, minutes: minutes}, function (err, ctcs) {
                ctcs.forEach(ctc => {
                    console.log(`Cleaning channel ${ctc.id}`)
                    let chan = client.channels.cache.get(ctc.id);
                    chan.messages.fetch()
                    .then(messages => {
                        messages.forEach(message => {
                            if (!message.pinned) {
                                message.delete();
                            }
                        });
                    });
                });
            });

            // WeekCalendar Service
            WeekCalendar.find({hours: hours, minutes: minutes, day: day}, async function (err, ctwc) {
                ctwc.forEach(async (ctc) => {
                    console.log(`Sending calendar in channel ${ctc.id}`)
                    let chan = client.channels.cache.get(ctc.id);
                    
                    let desc = "";
                    let i = 0;
                    let descDay = "";
                    let descIcon = "";

                    const guildId = chan.guildId;

                    while (i <= 7) {

                        switch(i) {
                            case 1:
                                descDay = await trans(guildId, "Monday"); 
                                descIcon = "1️⃣"; 
                                break;
                            case 2:
                                descDay = await trans(guildId, "Tuesday");
                                descIcon = "2️⃣";
                                break;
                            case 3:
                                descDay = await trans(guildId, "Wednesday");
                                descIcon = "3️⃣"; 
                                break;
                            case 4:
                                descDay = await trans(guildId, "Thursday");
                                descIcon = "4️⃣";
                                break;
                            case 5:
                                descDay = await trans(guildId, "Friday");
                                descIcon = "5️⃣";
                                break;
                            case 6:
                                descDay = await trans(guildId, "Saturday"); 
                                descIcon = "6️⃣"; 
                                break;
                            case 7:
                                descDay = await trans(guildId, "Sunday");
                                descIcon = "7️⃣";
                                break;
                        }

                        desc = desc + descIcon + " " + descDay + "\n";

                        i++;
                    }

                    let title = ctc.title ? ctc.title : await trans(guildId, 'Weekly Calendar');
                    const embed = new EmbedBuilder()
                        .setTitle(title)
                        .setColor('#00a3b5')
                        .setDescription(desc)
                        .setTimestamp();

                    chan.send({ embeds: [embed] })
                        .then(function(msg) {
                            msg.react('1️⃣');
                            msg.react('2️⃣');
                            msg.react('3️⃣');
                            msg.react('4️⃣');
                            msg.react('5️⃣');
                            msg.react('6️⃣');
                            msg.react('7️⃣');
                        });

                });
            });

            // Challenger automatic roles service
            Guild.find({challengerSetRoles: true}, async function (err, guilds) {
                for (const guildObj of guilds) {
                    let guild = client.guilds.cache.get(guildObj.id);
                    if (guild) {
                        ChallengerRank.find({guildId: guildObj.id}, async function (err, ranks) {
                            if (err) {
                                console.log(`Challenger rank error: ${err}`);
                                return;
                            }
                            guild.members.fetch().then(async members => {
                                let memberIds = members.map(member => member.user.id);
                                let collected = await getPlayerData(memberIds);
                                let data = [];
                                for (let id in collected) {
                                    data.push(collected[id]);
                                }
                                for (let i = 0; i < data.length; i++) {
                                    let userData = data[i];
                                    if(userData !== null){
                                        let member = await client.guilds.cache.get(guildObj.id).members.fetch(userData.discordId);
                                        if(member){
                                            for (let rank of ranks) {
                                                if (rank.id === userData.rankId && !member.roles.cache.find(r => r.id === rank.roleId)) {
						    console.log("add role "+rank.roleId+" for user "+member.displayName);
                                                    member.roles.add(rank.roleId);
                                                } else if (rank.id !== userData.rankId && member.roles.cache.find(r => r.id === rank.roleId)) {
						    console.log("remove role "+rank.roleId+" for user "+member.displayName);
                                                    member.roles.remove(rank.roleId);
						}
                                            }
                                        }
                                    }
                                }
                            });
                        })
                    }
                }
            })

            // Leaderboard updates service
            Guild.find({}, async function (err, guilds) {
                const data = await getLeaderboardData(0);
                for (const guildObj of guilds) {
                    let guild = client.guilds.cache.get(guildObj.id);
                    if (guild) {
                        ChallengerBoard.find({guildId: guildObj.id}, async function (err, boards) {
                            if (err) {
                                console.log(`Challenger board error: ${err}`);
                                return;
                            }
                            for (const board of boards) {
                                const embed = new EmbedBuilder()
                                    .setTitle(await trans(board.guildId, 'leaderboard'))
                                    .setImage('https://orianagames.com/build/images/Challenger.ico')
                                    .setURL('https://orianagames.com/challenger/')
                                    .setDescription(
                                        data.map((currElement, index) => "**__#" + (parseInt(index) + 1) + "__** [" + EMOJIS[data[index].rankId] + "**" + data[index].rankName + "** `(" + data[index].rankPercent + "%)`] - **[" + data[index].user + "](https://orianagames.com/player/" + data[index].user + ")**").join("\n")
                                    )
                                let channel = client.channels.cache.get(board.channelId);
                                if (channel) {
                                    channel.messages.fetch(board.id).then(async msg => {
                                        msg.edit({ embeds: [embed]});
                                    })
                                }
                            }
                        });
                    }
                }
            });

        }, 60 * 1000);

        // Cron for channels names only twice per 10 minutes
        setInterval(() => {
            // MembersCount service
            Guild.find({  }, async function (err, guilds) {
                for (const guildObj of guilds) {
                    if (guildObj.membersCountChannel !== null) {
                        let guild = client.guilds.cache.get(guildObj.id);
                        let membersText = await trans(guildObj.id, 'members');
                        if (guild) {
                            let membersCount = guild.memberCount;
                            let channel = guild.channels.cache.get(guildObj.membersCountChannel);
                            if (channel) {
                                channel.setName(`${membersCount} ${membersText}`);
                                console.log(`Updating members count in "${channel.name}" to ${membersCount}`);
                            }
                        }
                    }
                }
            });
        }, 5 * 60 * 1000);

        // Cron for stream boards only every 5 minutes
        setInterval(async () => {
            // MembersCount service

            StreamBoard.find({}, async function (err, streamBoards) {
                for (const streamBoard of streamBoards) {
                    let guild = client.guilds.cache.get(streamBoard.guildId);
                    if (guild) {
                        let guildId = streamBoard.guildId;
                        let actif = await trans(guildId, 'active');
                        let inactif = await trans(guildId, 'inactive');
                        let streamLines = await StreamLine.find({guildId: streamBoard.guildId, channelId: streamBoard.channelId});

                        let desc = '';
                        streamLines.forEach(streamLine => {
                            // Récupère l'utilisateur
                            let user = guild.members.cache.get(streamLine.userId);
                            if (user && user.presence) {
                                // Cherche si l'utilisateur est en train de streamer
                                let isStreaming = user.presence.activities ? user.presence.activities.find(activity => activity.type === 'STREAMING') : null;
                                let streamUrl = isStreaming ? isStreaming.url : '';
                                desc += '- <@' + streamLine.userId + '>: ' + (isStreaming ? actif + ' (<' + streamUrl + '>)' : inactif) + '\n';
                            } else {
                                desc += '- <@' + streamLine.userId + '>: '+inactif+'\n';
                            }
                        });

                        const embed = new EmbedBuilder()
                            .setTitle(await trans(guildId, 'streamers_title'))

                        if (desc !== '') {
                            embed.setDescription(desc);
                        }

                        let channel = client.channels.cache.get(streamBoard.channelId);
                        if (channel) {
                            channel.messages.fetch(streamBoard.id).then(async msg => {
                                msg.edit({embeds: [embed]});
                            }).catch(console.error);
                        }
                    }
                }
            });
        }, 60 * 1000);

        // Bot start

        client.user.setStatus('online');
        client.user.setActivity(process.env.HOST_URL, { type : ActivityType.custom });

        if (process.env.ENV === "PROD") {
            await client.application.commands.set(client.commands.map(command => command));
            console.log('Medbot started');
        } else {
            const devGuild = await client.guilds.cache.get(process.env.DEV_GUILD);
            await devGuild.commands.set(client.commands.map(command => command));
            console.log('Medbeta started');
        }
        
    }
}
