import {GuildMember, Message} from 'discord.js';
//@ts-ignore
import {BotConfig} from '@customTypes/global';

exports.User = class {
    message: Message;
    member: GuildMember;
    player: any;
    config: BotConfig;
    command: any;
    constructor(message: any, verify: any, config: any, command: any) {
        this.message = message;
        this.member = verify.member;
        this.player = verify.player;
        this.config = config;
        this.command = command;
    }

    getRoles = (types: string[]) => {
        if (!types) throw 'No role types arguement defined';

        const ranks = require('../files/ranks.json');
        const member = this.member;

        const returnRoleID = (list: any, type: any) => {
            return list.map((item: any, key: any) => {
                const name = Object.keys(ranks[type])[key];
                const id = type === 'prestige' ? list[key].id : list[key];
                if (!member.roles.cache.has(id)) return;

                return {name, id, type: type.toUpperCase()};
            });
        };

        const buildArray = (types: string[]) => {
            return types
                .map((type: string) => {
                    const exists: boolean = Object.keys(ranks).some((name: string) => name === type)!;
                    if (!exists) return console.error(`Type can only be: ${Object.keys(ranks)}`);

                    const list = Object.values(ranks[type]);
                    return returnRoleID(list, type);
                })
                .flat()
                .filter((i: string) => i);
        };

        return buildArray(types);
    };

    getPrestige = (player: any) => {
        if (!player) throw 'prestigeMatching requires a player arguement';

        const ranks = require('../files/ranks.json');
        const list = ranks['prestige'];
        const level = player.achievements.bedwars_level;
        const found = [];

        for (const rank in list) if (level > list[rank].level) found.push(list[rank]);

        const levels = found.map((item) => item.level);
        const highest = Math.max.apply(null, levels);

        const name = Object.keys(list).find((key) => list[key].level === highest);
        const id = ranks['prestige'][name!].id;

        return {name, id};
    };

    getFkdr = (player: any) => {
        if (!player) return console.error('fkdrMatching requires a player arguement');

        const ranks = require('../files/ranks.json');
        const list = ranks['fkdr'];

        const userFKDR = player.stats.Bedwars.final_kills_bedwars / player.stats.Bedwars.final_deaths_bedwars;
        const round = Math.floor(userFKDR * 10) / 10;

        function getRoleInfo() {
            if (round % 1 == 0) {
                const name = `${round}.0 FKDR`;
                const id = list[name];
                return {name, id};
            }
            if (userFKDR >= 125) {
                const name = '125+ FKDR';
                const id = list[name];
                return {name, id};
            }
            if (userFKDR >= 20) {
                const name = `${Math.floor(Math.floor(userFKDR * 10) / 50) * 5}+ FKDR`;
                const id = list[name];
                return {name, id};
            }
            if (userFKDR >= 10) {
                const name = `${Math.floor(Math.floor(userFKDR * 10) / 20) * 2}+ FKDR`;
                const id = list[name];
                return {name, id};
            }
            {
                const name = `${round} FKDR`;
                const id = list[name];
                return {name, id};
            }
        }

        return getRoleInfo();
    };

    getNickname = (positions: any, player: any) => {
        const getIcon = (level: any) => (level < 1000 ? '???' : level < 2000 ? '???' : '???');

        const level = player.achievements.bedwars_level;
        const name = player.displayname;
        const star = getIcon(level);

        const position = positions.length !== 0 ? positions[0].name : `${level}${star}`;
        return `[${position}] ${name}`;
    };

    valid = (player: any) => {
        // ? Unlinked account
        if (!player?.socialMedia?.links?.DISCORD) {
            throw {
                title: "This account isn't yet linked to a Discord account",
                description: 'Make sure you have linked your Discord and Minecraft account on the Hypixel social menu in game',
            };
        }

        // ? Incorrect discord
        if (player?.socialMedia?.links?.DISCORD !== `${this.member.user.username}#${this.member.user.discriminator}`) {
            throw {
                title: 'The Discord account was incorrect',
                description: 'The Discord account linked on Hypixel is different from yours',
            };
        }

        // ? If no bedwars level was found
        if (!player.achievements.bedwars_level) {
            throw {
                title: "We couldn't find any Bedwars stats for this account",
                description: 'Make sure you at least are level 1 in Bedwars on the Hypixel server',
            };
        }
    };

    fetchMojang = async (username: any) => {
        const fetch = require('node-fetch');

        try {
            const mojangApi = await fetch(`http://api.mojang.com/users/profiles/minecraft/${username}`);
            return await mojangApi.json();
        } catch (error) {
            throw {
                title: 'Mojang API Request failed',
                description: "Mostlikely your username doesn't exist, check the spelling and make sure its a premium account \nIf this isn't the case please report to one of the devs with the `Cause`",
                fields: [
                    {
                        name: 'Cause',
                        value: error || 'Unknown',
                    },
                ],
            };
        }
    };

    fetchHypixel = async (uuid: any) => {
        const fetch = require('node-fetch');

        try {
            const hypixelApi = await fetch(`http://api.hypixel.net/player?key=${process.env.HYPIXEL_API_KEY}&uuid=${uuid}`);
            const hypixelData = await hypixelApi.json();
            if (!hypixelData.success) throw hypixelData.cause;
            return hypixelData;
        } catch (error) {
            throw {
                title: 'Hypixel API Request failed',
                description: 'Please report to one of the devs with the `Cause`',
                fields: [
                    {
                        name: 'Cause',
                        value: error || 'Unknown',
                    },
                ],
            };
        }
    };

    removeRoles = async (roles: any) => {
        const member = this.member;
        for (const key in roles) {
            const role = roles[key];

            try {
                await member.roles.remove(role.id);
                console.log(`Removed ${role.name} from ${member.id} | ${member.user.tag}`);
            } catch (error) {
                throw {
                    title: `To remove your old role please run \`${this.config.prefix}update ign\` after a few minutes`,
                    description: role.name,
                    fields: [
                        {
                            name: 'Cause',
                            value: error,
                        },
                        {
                            name: 'Code',
                            value: error.code,
                        },
                    ],
                };
            }
        }
        return;
    };

    addRoles = async (roles: any) => {
        const member = this.member;
        for (const key in roles) {
            const role = roles[key];

            try {
                await member.roles.add(role.id);
                console.log(`Added ${role.name} to ${member.id} | ${member.user.tag}`);
            } catch (error) {
                throw {
                    title: 'Failed to add role',
                    description: `To get your role please run \`${this.config.prefix}update ign\` after a few minutes`,
                    fields: [
                        {
                            name: 'Role',
                            value: role.name,
                        },
                        {
                            name: 'Cause',
                            value: error,
                        },
                        {
                            name: 'Code',
                            value: error.code,
                        },
                    ],
                };
            }
        }
        return;
    };

    setNickname = async (nickname: any) => {
        const member = this.member;
        try {
            await member.setNickname(nickname);
            console.log(`Set nickname ${nickname} to ${member.id} | ${member.user.tag}`);
        } catch (error) {
            throw {
                title: 'Failed to set nickname',
                description: `To get your nickname please run \`${this.config.prefix}update ign\` after a few minutes`,
                fields: [
                    {
                        name: 'Nickname',
                        value: nickname,
                    },
                    {
                        name: 'Cause',
                        value: error,
                    },
                    {
                        name: 'Code',
                        value: error.code,
                    },
                ],
            };
        }
    };
};
