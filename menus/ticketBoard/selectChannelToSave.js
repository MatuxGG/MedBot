const { trans } = require('../../utils/Translator.js');
const { Guild } = require('../../models/index');
const discordTranscripts = require("discord-html-transcripts");
const {EmbedBuilder} = require("discord.js");

module.exports = {
    name: 'selectChannelToSave',
    run: async (client, interaction) => {
        const selectChannelId = interaction.values[0];

        const chan = await client.channels.fetch(selectChannelId);

        const attachment = await discordTranscripts.createTranscript(chan, {
            saveImages: true,
            filename: `transcript-${chan.name}.html`,
            poweredBy: false,
        });

        interaction.channel.send({
            files: [attachment],
        });

        interaction.deferUpdate();
    }
}
