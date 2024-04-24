const { trans } = require("../../utils/Translator");

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(client, interaction) {
        const guildId = interaction.channel.guildId;
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command){
                return interaction.reply(await trans(guildId, "cmd_no_exist"));
            }

            if (!interaction.member.permissions.has([command.permissions])){
                return interaction.reply( { content: await trans(guildId, "cmd_no_perm") + ` (${command.permissions.join(', ')})`, ephemereal: true });
            }

            command.runSlash(client, interaction);
        } else if (interaction.isModalSubmit()) {
            const [modalId, data] = interaction.customId.split('-'); // Gestion du role envoyé

            const modal = client.modals.get(modalId);
            if (!modal) {
                return interaction.reply(await trans(guildId, "modal_no_exist"));
            }

            modal.saveData(client, interaction, data);
        } else if (interaction.isButton()) {
            const buttonId = interaction.customId;
            const button = client.mbuttons.get(buttonId);
            if (!button) {
                return interaction.reply(await trans(guildId, "button_no_exist"));
            }

            button.run(client, interaction);
        } else if (interaction.isStringSelectMenu()) {
            const selectMenuId = interaction.customId;
            const selectMenu = client.menus.get(selectMenuId);
            if (!selectMenu) {
                return interaction.reply(await trans(guildId, "menu_no_exist"));
            }

            selectMenu.run(client, interaction);
        }
    }
}