exports.BotInstance = class {
    constructor() {
        this.Discord = require('discord.js');
        this.client = new this.Discord.Client();
        this.config = require('../files/config.json');

        // ! Setup Moderator
        const {ModeratorInstance} = require('../classes/Moderator');
        this.Moderator = new ModeratorInstance();

        // ! Initialize commands on creation
        this.#initializeCommands();
    }

    #initializeCommands = () => {
        const fs = require('fs');
        const client = this.client;
        const Discord = this.Discord;

        client.commands = new Discord.Collection();
        const commands = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
        for (const file of commands) {
            const command = require(`../commands/${file}`);
            client.commands.set(command.name, command);
        }
    };

    errorMessage = (message, error) => {
        if (!error.title) throw new Error(error);

        message.channel.send({
            embed: {
                title: error.title,
                description: error.description,
                color: error.color ?? '#ff0000',
                thumbnail: {
                    url: error.thumbnail ?? this.client.user.avatarURL(),
                },
                fields: error.fields ?? [],
                footer: {
                    text: error.footer ?? `For ${message.member.user.tag}`,
                },
            },
        });
    };

    successMessage = (message, content) => {
        if (!content.title) throw new Error(content);

        message.channel.send({
            embed: {
                title: content.title,
                description: content.description,
                color: content.color ?? '#00ff00',
                thumbnail: {
                    url: content.thumbnail ?? this.client.user.avatarURL(),
                },
                fields: content.fields ?? [],
                footer: {
                    text: content.footer ?? `For ${message.member.user.tag}`,
                },
            },
        });
    };

    // ! Runs the command according to what is typed
    runCommand = (message) => {
        const client = this.client;
        const config = this.config;

        // ? Format message and split
        const commandMessage = message.content.slice(config.prefix.length).toLowerCase().split(' ');
        // ? First split is actual command
        const commandName = commandMessage[0];
        // ? Get command
        const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

        // ? Arguements array is created
        let args = [];

        // ? If there is arguements then add all to the messageArgs array
        if (commandMessage.length > 1) for (let arg = 1; arg < commandMessage.length; arg++) args.push(commandMessage[arg]);

        // ? Block if invalid
        if (message.author.bot || !command) return;

        console.log(`[Handler] Recieved ${commandName} ${args.length === 0 ? 'without arguements' : 'command with arguements:'} ${args}`);
        command.execute(message, args, config, this);
    };
};
