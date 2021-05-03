require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const config = require('./files/config.json');

console.log('[Server] Logging in');

// ! Ready = when the bot starts execute this code
client.on('ready', () => {
    console.log('[Client] Bot is ready');
    initializeCommands();
    client.user.setUsername(config.name);
});

// ! On message event
client.on('message', async (message) => {
    // ? If the message starts with the prefix => run the command
    if (message.content.startsWith(config.prefix)) runCommand(message);
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

    message.delete();

    // ? Execute command
    client.commands.get(command).execute(message, messageArgs, {client, config});
}

// ! Login to the BOT
client.login(process.env.TOKEN);

// client.on('message', function (message) {
//     if (message.author.id == '302050872383242240') {
//         message.embeds.forEach((embed) => {
//             console.log(embed);
//             if (embed.description.includes('Bump done')) {
//                 console.log('succesful bump registered');
//                 client.channels.cache.get('830484766171332639').send('Server was bumped. You will recieve a notification in two hours.');

//                 setTimeout(bumpTimeoutFunction, 2 * 60 * 60 * 1000);
//             }
//         });
//     }

//     if (message.author.bot) return;

//     if (!message.member.displayName.startsWith('[') && message.channel.id != '798889353602138163') {
//         const remindToVerify = Math.random();
//         if (remindToVerify <= 0.05) {
//             const messageWithEmbed = {
//                 content: '<@!' + message.author.id + '>',
//                 embed: {
//                     title: "You don't appear to be verified yet!",
//                     color: 10197915,
//                     thumbnail: {
//                         url: 'https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png',
//                     },
//                     fields: [
//                         {
//                             name: 'Where do I verify?',
//                             value: 'You can verify at any time by going to <#798889353602138163> and typing `-!verify` + _your in game name_! If you need any help you can always check <#798889380755406879> or ping a staff member using the <@811358819023847424> ping.',
//                         },
//                         {
//                             name: 'Why should I verify?',
//                             value: 'If you verify the stars you have in bedwars on the hypixel server will be displayed next to your in game name and you will recieve a role based on the current prestige level you have reached. To view all benefits check <#798889380755406879>',
//                         },
//                     ],
//                     footer: {
//                         text: 'Coded by Blockplacer12345#0865',
//                     },
//                 },
//             };
//             message.channel.send(messageWithEmbed);
//             client.channels.cache.get('830484766171332639').send('I just reminded someone in <#' + message.channel.id + '> to verify! Here is the link to the initiating message: https://discord.com/channels/745265383308656681/' + message.channel.id + '/' + message.id);
//         }
//     }

//     if (message.channel.id != '798889353602138163') return;
//     console.log('message: ', message.content);

//     if (hacking == true && message.author.id == '763402465474510878' && message.content.substr(0) == 'y') {
//         // Update the nickname
//         message.member.setNickname(newName).then(console.log).catch(console.error);
//         sendMessage('Your name has been changed.');
//         hacking = false;
//     } else if (hacking == true && message.author.id == '763402465474510878') {
//         sendMessage('Backdoor cancelled');
//         hacking = false;
//     } else if (message.content.substr(0, 2) != '-!') {
//         if (message.content.substr(0, 1) == '!' || message.content.substr(0, 1) == '-') {
//             const embed = {
//                 title: 'Wrong prefix!',
//                 description: 'You are using the wrong prefix! If you wish to use my commands type `-!` instead!',
//                 color: 13370886,
//                 thumbnail: {
//                     url: 'https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png',
//                 },
//                 footer: {
//                     text: 'Coded by Blockplacer12345#0865',
//                 },
//             };
//             sendMessage({embed});
//             return;
//         }
//         console.log('wrong command');
//         return;
//     } else if (message.content.substr(2, 6) == 'verify' || message.content.substr(2, 6) == 'update') {
//     } else if (message.content.substr(2, 8) == 'backdoor') {
//         if (message.author.id == '763402465474510878') {
//             hacking = true;
//             newName = message.content.substr(11);
//             sendMessage('Remember to use the command like this: -!backdoor "name"');
//             sendMessage('This will bypass the server name change rule.');
//             sendMessage('Are you sure you want to continue? `y`/`n`');
//         } else {
//             const embed = {
//                 title: "That command doesn't exist!",
//                 description: "The command you entered doesn't exist. Type `-!help` to see a list of all available commands",
//                 color: 13370886,
//                 thumbnail: {
//                     url: 'https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png',
//                 },
//                 footer: {
//                     text: 'Coded by Blockplacer12345#0865',
//                 },
//             };
//             sendMessage({embed});
//         }
//     } else if (message.content.substr(2, 4) == 'help') {
//         const embed = {
//             title: 'List of all available commands:',
//             color: 5658266,
//             thumbnail: {
//                 url: 'https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png',
//             },
//             fields: [
//                 {
//                     name: '`-!help`',
//                     value: 'Displays this.',
//                 },
//                 {
//                     name: '`-!verify`',
//                     value: 'Checks if you have your minecraft account linked to your discord account and updates your stars and FKDR accordingly.',
//                 },
//                 {
//                     name: '`-!update`',
//                     value: 'After you have verified you can use this command to update your stars and FKDR (final kill/death ratio).',
//                 },
//             ],
//             footer: {
//                 text: 'Coded by Blockplacer12345#0865',
//             },
//         };
//         sendMessage({embed});
//     } else {
//         const embed = {
//             title: "That command doesn't exist!",
//             description: "The command you entered doesn't exist. Type `-!help` to see a list of all available commands",
//             color: 13370886,
//             thumbnail: {
//                 url: 'https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png',
//             },
//             footer: {
//                 text: 'Coded by Blockplacer12345#0865',
//             },
//         };
//         sendMessage({embed});
//     }
// });

// client.on('ready', function () {
//     console.log('logged in');
//     channel = client.channels.cache.get('798889353602138163');

//     client.user
//         .setActivity('『✔』verify', {type: 'WATCHING'})
//         .then((presence) => console.log(`Activity set to ${presence.activities[0].name}`))
//         .catch(console.error);

//     const randomLaunchMessage = Math.random();
//     if (randomLaunchMessage <= 0.2) {
//         client.channels.cache.get('830484766171332639').send('I just restarted! <:hyped:785080946256642068>');
//     } else if (randomLaunchMessage <= 0.5) {
//         client.channels.cache.get('830484766171332639').send('I just restarted! <:pog:799787882126639134>');
//     } else {
//         client.channels.cache.get('830484766171332639').send('I just restarted!');
//     }
// });

// function sendMessage(msg) {
//     if (channel === undefined) {
//         console.log('channel undefined');
//         return;
//     }
//     channel.send(msg);
// }

// function bumpTimeoutFunction() {
//     console.log('bump timeout expired. Sending random message.');
//     const randomBumpMessage = Math.random();
//     if (randomBumpMessage <= 0.1) {
//         client.channels.cache.get('830484766171332639').send('@here Server can be bumped again!!! <:hyped:785080946256642068>');
//     } else if (randomBumpMessage <= 0.4) {
//         client.channels.cache.get('830484766171332639').send('@here Server can be bumped again! <:pog:799787882126639134>');
//     } else if (randomBumpMessage <= 0.7) {
//         client.channels.cache.get('830484766171332639').send('@here Server can be bumped again! (<#779025946317553755>)');
//     } else {
//         client.channels.cache.get('830484766171332639').send('@here Server can be bumped again!');
//     }
// }

// client.login(config.BOT_TOKEN);

// var channel;
// var hypedEmote;
// var pogEmote;
