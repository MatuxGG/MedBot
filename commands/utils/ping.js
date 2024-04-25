const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { trans } = require('../../utils/Translator.js');

module.exports = {
    name: 'ping',
    description: 'Ping command',
    descriptionLocalizations: {
        fr: 'Commande ping',
    },
    permissions: [],
    runSlash: async (client, interaction) => {
        let uptime = (Date.now() - client.readyTimestamp);

        // Convertir la durée d'uptime en secondes, minutes, heures et jours
        const seconds = Math.floor(uptime / 1000) % 60;
        const minutes = Math.floor(uptime / (1000 * 60)) % 60;
        const hours = Math.floor(uptime / (1000 * 60 * 60)) % 24;
        const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

        const ping = client.ws.ping;
        const guildId = interaction.channel.guildId;
        
        const latency_title = await trans(guildId, 'latency');
        const latency_message = await trans(guildId, 'latency_message', { ping });
        const uptime_title = await trans(guildId, 'uptime');
        const uptime_message = await trans(guildId, 'uptime_message', {days, hours, minutes, seconds} );

        const embed = new EmbedBuilder()
            .setTitle('Pong !')
            //.setImage(client.user.displayAvatarURL())
            .setURL('https://'+process.env.HOST_URL)
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {name : latency_title, value : latency_message, inline : false},
                {name : uptime_title, value : uptime_message, inline : false},
            )
            .setTimestamp()
            .setFooter(
                {text : interaction.user.username, iconURL : interaction.user.displayAvatarURL()}
            )

        interaction.reply({ embeds: [embed] })
    }
}
