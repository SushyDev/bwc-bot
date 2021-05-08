module.exports = {
    name: 'help',
    description: 'List all commands',
    execute(message, args, config, Bot) {
        // ? Format the commands
        const getCommandList = (commands) => {
            return commands.map((x) => {
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
