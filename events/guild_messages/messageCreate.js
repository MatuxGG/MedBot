const { Guild } = require('../../models/index');

module.exports = {
    name: 'messageCreate',
    once: false,
    execute(client, message) {
        if (message.author.bot) return;

        // Guild.findOne( { id: message.guild.id }, function (err, guild) {
        //     const prefix = guild.prefix;

        //     if (!message.content.startsWith(prefix)) return;

        //     const args = message.content.slice(prefix.length).trim().split(/ +/g);
        //     const commandName = args.shift().toLowerCase();

        //     if (commandName.length == 0) return;

        //     let command = client.commands.get(commandName);

        //     if (!message.member.permissions.has([command.permissions])) return message.reply(`You don't have enough permission to use this command. (${command.permissions.join(', ')})`);

        //     if (command) command.run(client, message, args);
        // });

        
    }
}