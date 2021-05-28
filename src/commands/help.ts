import {Message} from 'discord.js';
//@ts-ignore
import {BotConfig} from '@customTypes/global';

module.exports = {
    name: 'help',
    description: 'List all commands',
    execute(message: Message, args: any, Bot: any) {
        const config: BotConfig = Bot.config;

        // ? Format the commands
        const getCommandList = (commands: any) => {
            return commands.map((x: any) => {
                return {
                    name: `${x.name[0].toUpperCase()}${x.name.slice(1)}`,
                    value: `${x.description}\nUsage: \`${config.prefix + x.name}\`\n${x.aliases ? `Aliase(s): \`${x.aliases}\`` : ''}`,
                };
            });
        };

        // ? Create the embed
        const messageEmbed = {
            color: 0x0099ff,
            title: 'Help',
            description: 'Here is a list of commands',
            fields: [getCommandList(Bot.client.commands)],
            timestamp: new Date(),
        };
        message.channel.send({embed: messageEmbed});
    },
};
