const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { ChanToClean } = require('../../models/index');
const { trans } = require('../../utils/Translator.js');

module.exports = {
    name: 'addctc',
    description: 'Set up a channel to clean daily',
    descriptionLocalizations: {
        fr: 'Configure ce salon pour une suppression quotidienne'
    },
    permissions: ['MANAGE_GUILD'],
    options: [
        {
            name: 'timezone',
            nameLocalizations: {
                fr: 'fuseau'
            },
            description: 'Timezone',
            descriptionLocalizations: {
                fr: 'Fuseau horaire'
            },
            type: ApplicationCommandOptionType.Number,
            required: 'true',
            choices: [
                {
                    name: 'UTC',
                    value: 0
                },
                {
                    name: 'UTC+1',
                    value: 1
                },
                {
                    name: 'UTC+2',
                    value: 2
                },
                {
                    name: 'UTC+3',
                    value: 3
                },
                {
                    name: 'UTC+4',
                    value: 4
                },
                {
                    name: 'UTC+5',
                    value: 5
                },
                {
                    name: 'UTC+6',
                    value: 6
                },
                {
                    name: 'UTC+7',
                    value: 7
                },
                {
                    name: 'UTC+8',
                    value: 8
                },
                {
                    name: 'UTC+9',
                    value: 9
                },
                {
                    name: 'UTC+10',
                    value: 10
                },
                {
                    name: 'UTC+11',
                    value: 11
                },
                {
                    name: 'UTC+12',
                    value: 12
                },
                {
                    name: 'UTC+13',
                    value: 13
                },
                {
                    name: 'UTC+14',
                    value: 14
                },
                {
                    name: 'UTC+15',
                    value: 15
                },
                {
                    name: 'UTC+16',
                    value: 16
                },
                {
                    name: 'UTC+17',
                    value: 17
                },
                {
                    name: 'UTC+18',
                    value: 18
                },
                {
                    name: 'UTC+19',
                    value: 19
                },
                {
                    name: 'UTC+20',
                    value: 20
                },
                {
                    name: 'UTC+21',
                    value: 21
                },
                {
                    name: 'UTC+22',
                    value: 22
                },
                {
                    name: 'UTC+23',
                    value: 23
                }
            ]
        },
        {
            name: 'hour',
            nameLocalizations: {
                fr: 'heure'
            },
            description: 'Hour',
            descriptionLocalizations: {
                fr: 'Heure'
            },
            type: ApplicationCommandOptionType.Number,
            required: 'true',
            choices: [
                {
                    name: 0,
                    value: 0
                },
                {
                    name: 1,
                    value: 1
                },
                {
                    name: 2,
                    value: 2
                },
                {
                    name: 3,
                    value: 3
                },
                {
                    name: 4,
                    value: 4
                },
                {
                    name: 5,
                    value: 5
                },
                {
                    name: 6,
                    value: 6
                },
                {
                    name: 7,
                    value: 7
                },
                {
                    name: 8,
                    value: 8
                },
                {
                    name: 9,
                    value: 9
                },
                {
                    name: 10,
                    value: 10
                },
                {
                    name: 11,
                    value: 11
                },
                {
                    name: 12,
                    value: 12
                },
                {
                    name: 13,
                    value: 13
                },
                {
                    name: 14,
                    value: 14
                },
                {
                    name: 15,
                    value: 15
                },
                {
                    name: 16,
                    value: 16
                },
                {
                    name: 17,
                    value: 17
                },
                {
                    name: 18,
                    value: 18
                },
                {
                    name: 19,
                    value: 19
                },
                {
                    name: 20,
                    value: 20
                },
                {
                    name: 21,
                    value: 21
                },
                {
                    name: 22,
                    value: 22
                },
                {
                    name: 23,
                    value: 23
                }
            ]
        },
        {
            name: 'minute',
            nameLocalizations: {
                fr: 'minute'
            },
            description: 'Minute',
            descriptionLocalizations: {
                fr: 'Minute'
            },
            type: ApplicationCommandOptionType.Number,
            required: 'true',
            choices: [
                {
                    name: 0,
                    value: 0
                },
                {
                    name: 5,
                    value: 5
                },
                {
                    name: 10,
                    value: 10
                },
                {
                    name: 15,
                    value: 15
                },
                {
                    name: 20,
                    value: 20
                },
                {
                    name: 25,
                    value: 25
                },
                {
                    name: 30,
                    value: 30
                },
                {
                    name: 35,
                    value: 35
                },
                {
                    name: 40,
                    value: 40
                },
                {
                    name: 45,
                    value: 45
                },
                {
                    name: 50,
                    value: 50
                },
                {
                    name: 55,
                    value: 55
                }
            ]
        }
    ],
    runSlash: (client, interaction) => {
        const newTz = interaction.options.getNumber('timezone');
        let newHours = interaction.options.getNumber('hours') - newTz;
        if (newHours < 0) {
            newHours = newHours + 24;
        }
        const newMinutes = interaction.options.getNumber('minutes');
        
        ChanToClean.countDocuments({id: interaction.channel.id}, async function (err, count){ 
            const guildId = interaction.channel.guildId;
            const obj = await trans(guildId, "Channel to clean");
            if(count<=0){
                const createChan = new ChanToClean({ id: interaction.channel.id, hours: newHours, minutes: newMinutes, guildId: guildId });
                createChan.save().then(c => console.log(`New channel to clean : ${c.id}`));
                const reply = await trans(guildId, 'added_success', { obj: obj } );
                interaction.reply({content:  reply, ephemeral: true});
            } else {
                const reply = await trans(guildId, 'updated_success', { obj:obj } );
                ChanToClean.findOneAndUpdate( { id: interaction.channel.id }, {hours: newHours, minutes: newMinutes }, function (err, chanToClean) {
                    interaction.reply({content: reply, ephemeral: true});
                });
            }
        }); 

        
    }
}
