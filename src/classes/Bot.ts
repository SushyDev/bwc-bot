import {Collection, Message, MessageEmbed} from 'discord.js';
//@ts-ignore
import {EmbedContent, BotConfig} from '@customTypes/global';

exports.BotInstance = class {
    Discord: any;
    client: any;
    config: BotConfig;
    bumped: boolean;
    Moderator: any;

    constructor() {
        this.Discord = require('discord.js');
        this.client = new this.Discord.Client();
        this.config = require('../files/config.json');
        this.bumped = false;

        // ! Setup Moderator
        const {ModeratorInstance} = require('../classes/Moderator');
        this.Moderator = new ModeratorInstance();

        // ! Initialize commands on creation
        this.#initializeCommands();
    }

    #initializeCommands = () => {
        const path = require('path');
        const fs = require('fs');
        const client = this.client;
        const Discord = this.Discord;

        client.commands = new Discord.Collection();
        const commands: Collection<object, object> = fs.readdirSync(path.resolve(__dirname, '../commands')).filter((file: any) => file.endsWith('.js'));
        for (const file of commands) {
            const command = require(`../commands/${file}`);
            client.commands.set(command.name, command);
        }
    };

    errorMessage = (message: Message, error: any): void => {
        if (!error.title) {
            console.error(error);
            return;
        }

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
                    text: error.footer ?? `For ${message.member!.user.tag}`,
                },
            } as MessageEmbed,
        });
    };

    successMessage = (message: Message, content: EmbedContent): void => {
        if (!content.title) {
            console.error(content);
            return;
        }

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
                    text: content.footer ?? `For ${message.member!.user.tag}`,
                },
            } as MessageEmbed,
        });
    };

    // ! Runs the command according to what is typed
    runCommand = (message: Message) => {
        const client = this.client;
        const config = this.config;

        // ? Format message and split
        const commandMessage: string[] = message.content.slice(config.prefix.length).toLowerCase().split(' ');
        // ? First split is actual command
        const commandName: string = commandMessage[0];
        // ? Get command
        const command: {execute: Function} = client.commands.get(commandName) || client.commands.find((cmd: {aliases: string[]}) => cmd.aliases && cmd.aliases.includes(commandName));

        // ? Arguements array is created
        let args: string[] = [];

        // ? If there is arguements then add all to the messageArgs array
        if (commandMessage.length > 1) for (let arg = 1; arg < commandMessage.length; arg++) args.push(commandMessage[arg]);

        // ? Block if invalid
        if (message.author.bot || !command) return;

        console.log(`[Handler] Recieved ${commandName} ${args.length === 0 ? 'without arguements' : 'command with arguements:'} ${args}`);
        command.execute(message, args, this);
    };
};
