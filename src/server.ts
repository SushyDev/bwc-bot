import {Message, MessageEmbed} from 'discord.js';
require('dotenv').config();

const {BotInstance} = require('./classes/Bot');
const Bot: any = new BotInstance();
const client: any = Bot.client;
const config: any = Bot.config;

// ! Login
client.login(process.env.TOKEN);

// ! Ready = when the bot starts execute this code
client.on('ready', () => {
    console.log('Ready');
    client.user.setPresence(config.presense);
    setInterval(() => checkForBump(), 600000);

    // ! Important
    //@ts-ignore
    const embed: MessageEmbed = {
        author: {
            name: `${client.user.username} is ready`,
            iconURL: client.user.avatarURL(),
        },
        fields: [
            {
                name: 'Version',
                value: require('../package.json').version,
                inline: true,
            },
            {
                name: 'Prefix',
                value: config.prefix,
                inline: true,
            },
        ],
        timestamp: new Date().getTime(),
    };

    client.channels.cache.get('830484766171332639').send({embed});
});

// ! On message event
client.on('message', async (message: Message) => {
    // ? If the message starts with the prefix run the command
    if (message.content.startsWith(config.prefix)) Bot.runCommand(message);

    if (message.author.id === '302050872383242240' && message.embeds[0]?.description!.includes('Bump done')) {
        client.channels.cache.get('830484766171332639').send('Server was bumped. You will recieve a notification in two hours.');
    }

    if (message.author.bot && message.channel.id === '815887245855686656') message.delete();
});

// ! Check if bump is ready
const checkForBump = async () => {
    const guild = client.guilds.cache.get('745265383308656681');
    const channel = guild.channels.cache.get('779025946317553755');

    try {
        const messages = await channel.messages.fetch({limit: 20});
        const found = messages.find((message: any) => message.author.id === '302050872383242240' && message.embeds[0]?.description.includes('Bump done') && message?.createdTimestamp);
        const ready = found.createdTimestamp + 7200000;
        const now = new Date().getTime();
        if (now > ready) client.channels.cache.get('830484766171332639').send('@here <#779025946317553755> is ready');
    } catch (error) {
        console.error(error);
    }
};
