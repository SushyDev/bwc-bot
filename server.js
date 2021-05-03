require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const config = require('./files/config.json');

// ! Should probably make a class for the bot for [errorMessage, successMessage] and other bot events

// ! Ready = when the bot starts execute this code
client.on('ready', () => {
    console.log('[Client] Ready');
    client.channels.cache.get('830484766171332639').send(`\`Client ready @ ${new Date().toUTCString()}\``);
    initializeCommands();
    updatePresence();
});

// ! On message event
client.on('message', async (message) => {
    // ? If the message starts with the prefix => run the command
    if (message.content.startsWith(config.prefix)) runCommand(message);

    if (message.author.id === '302050872383242240') {
        client.channels.cache.get('830484766171332639').send('Server was bumped. You will recieve a notification in two hours.');
        // ? 2hrs 5 minutes
        setTimeout(() => client.channels.cache.get('830484766171332639').send('@here Server can be bumped again!'), 7500000);
    }
});

// ! Initializes all commands
function initializeCommands() {
    console.log('[Initializer] Initializing commands');
    client.commands = new Discord.Collection();
    const commands = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
    for (const file of commands) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
    console.log('[Initializer] Initialized commands');
}

function updatePresence() {
    if (client.user.avatarURL() !== config.avatar) client.user.setAvatar(config.avatar).catch((err) => {});
    if (client.user.username !== config.name) client.user.setUsername(config.name).catch((err) => {});
    client.user.setPresence(config.presense);
}

// ! Runs the command according to what is typed
function runCommand(message) {
    // ? Format message and split
    const commandMessage = message.content.slice(config.prefix.length).toLowerCase().split(' ');
    // ? First split is actual command
    const command = commandMessage[0];
    // ? Arguements array is created
    let messageArgs = [];

    // * If there is arguements then add all to the messageArgs array
    if (commandMessage.length > 1) for (let arg = 1; arg < commandMessage.length; arg++) messageArgs.push(commandMessage[arg]);

    // ! Block if invalid
    if (message.author.bot || !client.commands.has(command)) return;

    console.log(`[Handler] Recieved ${command} ${messageArgs.length === 0 ? 'without arguements' : 'command with arguements:'} ${messageArgs}`);

    // ? Execute command
    client.commands.get(command).execute(message, messageArgs, {client, config});
}

// ! Login to the BOT
client.login(process.env.TOKEN);
