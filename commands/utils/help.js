const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require("discord.js");
const { trans } = require('../../utils/Translator.js');
const {Guild} = require("../../models");

module.exports = {
    name: 'help',
    description: 'Help command (English only)',
    descriptionLocalizations: {
        fr: 'Commande aide',
    },
    permissions: [],
    runSlash: async (client, interaction) => {

        let guildId = interaction.channel.guildId;

        let guild = await Guild.findOne({ id: guildId });
        if (!guild) {
            console.log("Help error: No guild");
            return;
        }
        const lg = guild.lg ? guild.lg : 'en';

        let description = '';
        let title = '';
        switch (lg) {
            case 'fr':
                title = 'Aide';
                description += 'MedBot est le bot officiel multifonctionnel de Good Loss.\n' +
                    'Voici une liste de toutes les fonctionnalités disponibles du bot !\n\n';

                // Commandes pour commencer
                description += "🚀 **__Pour commencer :__**\n\n";
                description += "- /setlg **Langue**: Sélectionnez **Langue** comme langue utilisée pour ce serveur.\n";
                description += "- /setlogchannel: Sélectionnez le salon des logs pour ce serveur.\n";

                // Commandes administrateur
                description += "\n🔒 **__Commandes administrateur :__**\n\n";
                description += "- /config: Obtenez la configuration globale.\n";
                description += "- /batchdeletechannels: Supprimez tous les autres salons et catégories de ce serveur.\n";
                description += "- /batchremovemembers: Supprimez tous les autres membres de ce serveur.\n";

                // Commandes de modération
                description += "\n🛡️ **__Commandes de modération :__**\n\n";

                // Module de rangs Challenger
                description += "🔪 **__Module de rangs Challenger :__**\n\n";
                description += "*Ce module permet d'attribuer automatiquement un rang lorsqu'un utilisateur connecté à Good Loss avec son compte Discord atteint un certain rang.*\n\n";
                description += "- /setchallengerstatus [Vrai/Faux]: Activez ou désactivez le module de rangs Challenger pour ce serveur, désactivé par défaut.\n";
                description += "- /setchallengerrank **Nom** **Rôle**: Définissez l'un des rangs Challenger globalement pour ce serveur. Vous pouvez choisir un **Rôle** du serveur à associer à un rang officiel Challenger **Nom**.\n";

                // Module de classement Challenger
                description += "\n🏆 **__Module de classement Challenger :__**\n\n";
                description += "*Ce module permet d'afficher le classement officiel de Challenger dans un salon.*\n\n";
                description += "- /addchallengerboard **Salon**: Ajoutez un nouveau panneau affichant le classement officiel de Challenger dans le salon actuel.\n";

                // Module Chan to clean
                description += "\n🧹 **__Module Chan to clean :__**\n\n";
                description += "*Ce module permet de nettoyer automatiquement un salon à une certaine heure.*\n\n";
                description += "- /addctc **FuseauHoraire** **Heure** **Minute**: Ajoutez un salon à nettoyer tous les jours à l'heure sélectionnée (**Heure:Minute** dans **FuseauHoraire**).\n";
                description += "- /delctc: Supprimez le processus de nettoyage pour le salon actuel.\n";

                // Module du compte des membres
                description += "\n👥 **__Module du compte des membres :__**\n\n";
                description += "*Ce module permet d'afficher le nombre de membres dans un salon vocal.*\n\n";
                description += "- /setmemberscount: Génère un salon vocal qui affichera le nombre de membres sur le serveur.\n";
                description += "- /unsetmemberscount: Supprime le salon vocal qui affiche le nombre de membres sur le serveur.\n";

                // Module Clear
                description += "\n🗑️ **__Module Clear :__**\n\n";
                description += "*Ce module permet de supprimer un certain nombre de messages dans le salon actuel.*\n\n";
                description += "- /clear **Quantité**: Supprime les **Quantité** derniers messages dans le salon actuel.\n";

                // Module des panneaux de stream
                description += "\n🔴 **__Module des panneaux de stream :__**\n\n";
                description += "*Ce module permet d'afficher des panneaux de stream dans un salon, avec des streamers en vedette.*\n\n";
                description += "- /addstreamboard: Ajoutez un nouveau panneau de stream dans le salon actuel.\n";
                description += "- /addstreamer **@Streamer**: Ajoutez un nouveau **@Streamer** au panneau de stream dans le salon actuel. Vous devez choisir un utilisateur du serveur.\n";
                description += "- /delstreamer **@Streamer**: Supprimez un **@Streamer** du panneau de stream dans le salon actuel. Vous devez choisir un des streamers disponibles.\n";

                // Module des panneaux de tickets
                description += "\n🎫 **__Module des panneaux de tickets :__**\n\n";
                description += "*Ce module permet de créer des panneaux de tickets dans le serveur.*\n\n";
                description += "- /addboard: Ajoutez un nouveau panneau de tickets dans le salon actuel. Vous devez choisir un rôle qui pourra gérer les tickets et diverses informations pour que le module fonctionne.\n";
                description += "- /settranscriptchannel: Définissez le salon où les transcriptions des tickets seront envoyées.\n";

                // Module de calendrier hebdomadaire
                description += "\n📅 **__Module de calendrier hebdomadaire :__**\n\n";
                description += "*Ce module permet de configurer un calendrier envoyé chaque semaine dans le salon actuel.*\n\n";
                description += "- /addwc **FuseauHoraire** **Heure** **Minute** **Message**: Ajoutez un calendrier hebdomadaire dans le salon actuel, envoyé chaque semaine à l'heure sélectionnée (**Heure:Minute** dans **FuseauHoraire**). Vous pouvez optionnellement ajouter un **Message** au calendrier.\n";
                description += "- /delwc: Supprimez le calendrier hebdomadaire dans le salon actuel.\n";

                // Diverses commandes
                description += "\n🎉 **__Diverses commandes :__**\n\n";
                description += "- /help: Affiche ce message d'aide.\n";
                description += "- /ping: Affiche la latence du bot.\n";
                description += "- /poll **Titre** **Réactions**: Créez un sondage dans le salon actuel avec un **Titre** et un ensemble de **Réactions**.\n";
                description += "- /say **Message** : Faites dire au bot **Message** dans le salon actuel.\n";
                description += "- /version: Affiche la version actuelle du bot.\n";

                break;
            default:
                title = 'Help';
                description += 'MedBot is the official multipurpose bot by Good Loss.\n' +
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
                description += "- /delctc: Remove the clean up process for the current channel.\n";

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
                description += "- /addstreamer **@Streamer**: Add a new **@Streamer** to the stream board in the current channel. You have to choose an user from the server.\n";
                description += "- /delstreamer **@Streamer**: Remove a **@Streamer** from the stream board in the current channel. You have to choose one of the available streamers.\n";

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
                break;
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description);

        interaction.reply({ embeds: [embed], ephemeral: true})
    }
}
