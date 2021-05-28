module.exports = {
    name: 'warn',
    aliases: ['warning'],
    description: 'Warning',
    async execute(message: any, args: any, Bot: any) {
        const config = Bot.config;
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

        try {
            saveWarning(message, warned, args[1]);
        } catch (error) {
            Bot.errorMessage(message, {
                title: 'Error saving warning',
                description: error.message,
            });
            return;
        }

        Bot.successMessage(message, {
            title: 'Warned',
            description: `Warned ${warned.user.username} for ${args[1]}`,
        });
    },
};

const saveWarning = (message: any, warned: any, reason: any) => {
    const path = require('path');
    const fs = require('fs');

    const contents = fs.readFileSync(path.join(process.cwd(), '/files/warnings.json'), {encoding: 'utf8'});

    const getWarnings = (data: any) => {
        try {
            return JSON.parse(data);
        } catch (error) {
            throw error;
        }
    };

    const warnings = getWarnings(contents);
    if (!warnings[warned.user.id]) warnings[warned.user.id] = [];
    warnings[warned.user.id].push({
        reason,
        timestamp: message.createdTimestamp,
        by: message.author.id,
    });

    try {
        fs.writeFileSync(path.join(process.cwd(), '/files/warnings.json'), JSON.stringify(warnings));
    } catch (error) {
        throw error;
    }
};
