import {GuildMember, Message} from 'discord.js';

exports.ModeratorInstance = class {
    message: Message;
    command: any;
    Bot: any;
    constructor(message: Message, command: any, Bot: any) {
        this.message = message;
        this.command = command;
        this.Bot = Bot;
    }

    isStaff = (member: GuildMember) => {
        const ranks = require('../files/ranks.json');
        return Object.values(ranks.staff).some((rank) => member.roles.cache.some((role: any) => role.id === rank));
    };
    getMember = async (id: string) => await this.message.guild!.members.fetch(id);
};
