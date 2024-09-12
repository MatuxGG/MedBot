const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { trans } = require('../../utils/Translator.js');

module.exports = {
    name: 'help',
    description: 'Help command (English only)',
    descriptionLocalizations: {
        fr: 'Commande aide',
    },
    permissions: [],
    runSlash: async (client, interaction) => {

        let description = 'MedBot is the official multipurpose bot by Good Loss.\n' +
            'Here is a list of all available features of the bot!\n\n';

        // Get started commands
        description += "🚀 **__Get started:__**\n\n";
        description += "- /setlg **Language**: Select **Language** as the language used for this server.\n";
        description += "- /setlogchannel: Select the logs channel for this server.\n";

        // Admin commands
        description += "\n🔒 **__Admin commands:__**\n\n";
        description += "- /config: Get the global configuration";
        description += "- /batchdeletechannels: Remove all other channels and categories in this server.\n";
        description += "- /batchremovemembers: Remove all other members of this server.\n";

        // Moderation commands
        description += "\n🛡️ **__Moderation commands:__**\n\n";

        // Challenger ranks module
        description += "🔪 **__Challenger ranks module:__**\n\n";
        description += "*This module allows to automatically set a rank when an user connected to Good Loss with their discord account reach a certain rank.*\n\n";
        description += "- /setchallengerstatus [True/False]: Enable or disable Challenger ranks module for this server, by default disabled.\n";
        description += "- /setchallengerrank **Name** **Role**: Set one of the challenger rank globally for this server. You can choose one of the server *Role** to be linked to one of the official Challenger rank **Name**\n";

        // Challenger boards module
        description += "\n🏆 **__Challenger boards module:__**\n\n";
        description += "*This module allows to display the official challenger leaderboard in a channel.*\n\n";
        description += "- /addchallengerboard **Channel**: Add a new panel displaying the official challenger leaderboard in the current channel.\n";

        // Chan to clean module
        description += "\n🧹 **__Chan to clean module:__**\n\n";
        description += "*This module allows to automatically clean a channel at a certain time.*\n\n";
        description += "- /addctc **Timezone** **Hour** **Minute**: Add a channel to clean everyday at the selected time (**Hour:Minute** in **Timezone**).\n";

        // Members count module
        description += "\n👥 **__Members count module:__**\n\n";
        description += "*This module allows to display the number of members in a voice channel.*\n\n";
        description += "- /setmemberscount: Generate a voice channel that will display the number of members in the server.\n";
        description += "- /unsetmemberscount: Unset the voice channel that display the number of members in the server.\n";

        // Clear module
        description += "\n🗑️ **__Clear module:__**\n\n";
        description += "*This module allows to clear a certain number of messages in the current channel.*\n\n";
        description += "- /clear **Amount**: Clear the last **Amount** messages in the current channel.\n";

        // Stream boards module
        description += "\n🔴 **__Stream boards module:__**\n\n";
        description += "*This module allows to display stream boards in a channel, with featured streamers.*\n\n";
        description += "- /addstreamboard: Add a new stream board in the current channel.\n";
        description += "- /addstreamer: Add a new streamer to the stream board in the current channel. You have to choose an user from the server.\n";
        description += "- /delstreamer: Remove a streamer from the stream board in the current channel. You have to choose one of the available streamers.\n";

        // Ticketing boards module
        description += "\n🎫 **__Ticketing boards module:__**\n\n";
        description += "*This module allows to create ticketing boards in the server.*\n\n";
        description += "- /addboard: Add a new ticket board in the current channel. You have to choose a role that will be able to manage tickets and various information for the module to work.\n";
        description += "- /settranscriptchannel: Set the channel where the ticket transcripts will be sent.\n";

        // Weekly calendar module
        description += "\n📅 **__Weekly calendar module:__**\n\n";
        description += "*This module allows to set up a calendar sent weekly in the current channel.*\n\n";
        description += "- /addwc **Timezone** **Hour** **Minute** **Message**: Add a weekly calendar in the current channel, sent every week at the selected time (**Hour:Minute** in **Timezone**). You can optionnally add a **Message** to the calendar.\n";
        description += "- /delwc: Remove the weekly calendar in the current channel.\n";

        // Various commands
        description += "\n🎉 **__Various commands:__**\n\n";
        description += "- /help: Display this help message.\n";
        description += "- /ping: Display the bot latency.\n";
        description += "- /poll **Title** **Reactions**: Create a poll in the current channel with a **Title** and a set of **Reactions**.\n";
        description += "- /say **Message** : Make the bot say **Message** in the current channel.\n";
        description += "- /version: Display the current version of the bot.\n";

        const embed = new EmbedBuilder()
            .setTitle('Help (English only)')
            .setDescription(description);

        interaction.reply({ embeds: [embed], ephemeral: true})
    }
}
