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
    client.user.setPresence(config.presense);

    initializeCommands();
    setTimeout(() => checkForBump(), 300000);
});

// ! On message event
client.on('message', async (message) => {
    // ? If the message starts with the prefix => run the command
    if (message.content.startsWith(config.prefix)) runCommand(message);

    if (message.author.id === '302050872383242240') {
        client.channels.cache.get('830484766171332639').send('Server was bumped. You will recieve a notification in two hours.');
    }
});

// ! Check if bump is ready
function checkForBump() {
    const guild = client.guilds.cache.get('745265383308656681');
    const channel = guild.channels.cache.get('779025946317553755');

    channel.messages
        .fetch({limit: 20})
        .catch((error) => console.error(error))
        .then((messages) => {
            const found = messages.find((message) => {
                if (!message.author.id !== '302050872383242240' && message.embeds[0]?.description.includes('Bump done') && message?.createdTimestamp) return message;
            });

            const ready = found.createdTimestamp + 7200000;
            const now = new Date().getTime();
            if (now > ready) client.channels.cache.get('830484766171332639').send('@here Server can be bumped again!');
        });
}

// ! Initializes all commands
function initializeCommands() {
    client.commands = new Discord.Collection();
    const commands = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
    for (const file of commands) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
    console.log('[Initializer] Initialized commands');
}

// ! Runs the command according to what is typed
function runCommand(message) {
    // ? Format message and split
    const commandMessage = message.content.slice(config.prefix.length).toLowerCase().split(' ');
    // ? First split is actual command
    const commandName = commandMessage[0];
    // ? Get command
    const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    // ? Arguements array is created
    let messageArgs = [];

    // ? If there is arguements then add all to the messageArgs array
    if (commandMessage.length > 1) for (let arg = 1; arg < commandMessage.length; arg++) messageArgs.push(commandMessage[arg]);

    // ? Block if invalid
    if (message.author.bot || !command) return;

    console.log(`[Handler] Recieved ${commandName} ${messageArgs.length === 0 ? 'without arguements' : 'command with arguements:'} ${messageArgs}`);
    command.execute(message, messageArgs, {client, config});
}

// ! Login to the BOT
client.login(process.env.TOKEN);
