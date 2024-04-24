const { ChanToClean, WeekCalendar } = require('../../models/index');
const { EmbedBuilder, ActivityType } = require("discord.js");
const dotenv = require('dotenv');
dotenv.config()
const { trans } = require('../../utils/Translator.js');
const { VERSION } = require('../../config');
const { Guild } = require('../../models/index')
const {getPlayerData} = require("../../utils/challenger/leaderboardUtils");
const {ChallengerRank} = require("../../models");

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

            Guild.find({challengerSetRoles: true}, async function (err, guilds) {
                console.log('starting')
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
                                                if (rank.id === userData.rankId) {
                                                    console.log("oui");
                                                    member.roles.add(rank.roleId);
                                                } else {
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

        }, 60 * 1000);

        const presenceText = 'goodloss.fr';
        client.user.setStatus('online');
        client.user.setActivity(presenceText, { type : ActivityType.custom });

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
