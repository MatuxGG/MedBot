const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');
const dotenv = require('dotenv');
dotenv.config()

const commands = [];

const clientId = process.env.CLIENT_ID;

const commandDirs = fs.readdirSync('./commands');

for (const dir of commandDirs) {
    const commandFiles = fs.readdirSync('./commands/' + dir).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
    	const command = require(`./commands/${dir}/${file}`);
    	commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
