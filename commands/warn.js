module.exports = {
    name: 'warn',
    aliases: ['warning'],
    description: 'Warning',
    async execute(message, args, config, Bot) {
        const guildID = message.guild.id;
        const guild = await Bot.client.guilds.cache.get(guildID);
        const warnedID = args[0].replace(/[^0-9]/g, '');
        const warned = await guild.members.cache.get(warnedID);

        if (!args[0]) {
            Bot.errorMessage(message, {
                title: 'No arguements given',
                description: `Usage: \`${config.prefix}${this.name} @User reason\``,
            });
            return;
        }

        if (!args[0].match(/<@(.*?)>/)) {
            Bot.errorMessage(message, {
                title: "First arguement isn't a user",
                description: `Usage: \`${config.prefix}${this.name} @User reason\``,
            });
            return;
        }

        if (!args[1]) {
            Bot.errorMessage(message, {
                title: 'No reason given',
                description: `Usage: \`${config.prefix}${this.name} @User reason\``,
            });
            return;
        }

        Bot.successMessage(message, {
            title: 'Warned',
            description: `Warned ${warned.user.username} for ${args[1]}`,
        });
    },
};
