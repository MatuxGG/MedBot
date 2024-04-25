// Require

const { Client, Collection, Partials, GatewayIntentBits  } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config()
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const { createConnection } = require('mysql');

const { loadTranslations } = require('./utils/Translator.js');

// Main

const client = new Client( {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User]
});

client.commands = new Collection();
client.modals = new Collection();
client.mbuttons = new Collection();
client.menus = new Collection();

['CommandUtils', 'EventUtils', 'ModalUtils', 'ButtonUtils', 'MenuUtils'].forEach(handler => { require(`./utils/handlers/${handler}`)(client); })

process.on('exit', code => { console.log(`Process was stopped with code ${code}`) });
process.on('uncaughtException', (err, origin) => { console.log(`--------\nUncaught Exception: ${err}\nOrigin: ${origin}\n--------`) });
process.on('unhandledRejection', (reason, promise) => {
    console.log(`--------\nUnhandled Rejection:\n${reason.stack}\n--------`)
});
process.on('warning', (...args) => { console.log(...args) });

// MongoDB connect

const options = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

mongoose.connect(process.env.DATABASE_URI, options);

mongoose.connection.once('open', function() {
    console.log("Connected to Medbot database");
});

mongoose.connection.on('error', function(err) {
    console.log("Database connection error:", err);
});

loadTranslations('en');
loadTranslations('fr');

if (process.env.ENV == "PROD") {
  client.login(process.env.PROD_TOKEN);
} else {
  client.login(process.env.DEV_TOKEN);
}
