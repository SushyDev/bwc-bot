require('dotenv').config();

// ? Classes
const {BotInstance} = require('./classes/Bot.js');

const Bot = new BotInstance();

const client = Bot.client;
const config = Bot.config;

// ! Login
client.login(process.env.TOKEN);

// ! Ready = when the bot starts execute this code
client.on('ready', () => {
    console.log('Ready');
    client.channels.cache.get('830484766171332639').send(`\`Client ready @ ${new Date().toUTCString()}\``);
    client.user.setPresence(config.presense);
    setInterval(() => checkForBump(), 300000);
});

// ! On message event
client.on('message', (message) => {
    // ? If the message starts with the prefix run the command
    if (message.content.startsWith(config.prefix)) Bot.runCommand(message);
    if (message.author.id === '302050872383242240') client.channels.cache.get('830484766171332639').send('Server was bumped. You will recieve a notification in two hours.');
});

// ! Check if bump is ready
const checkForBump = async () => {
    const guild = client.guilds.cache.get('745265383308656681');
    const channel = guild.channels.cache.get('779025946317553755');

    try {
        const messages = await channel.messages.fetch({limit: 20});
        const found = messages.find((message) => !message.author.id !== '302050872383242240' && message.embeds[0]?.description.includes('Bump done') && message?.createdTimestamp);
        const ready = found.createdTimestamp + 7200000;
        const now = new Date().getTime();
        if (now > ready) client.channels.cache.get('830484766171332639').send('@here Server can be bumped again!');
    } catch (error) {
        console.error(error);
    }
};
