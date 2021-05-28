const {User} = require('../classes/User');
module.exports = {
    name: 'verify',
    aliases: ['update'],
    description: 'Gives FKDR and Prestige roles based on your Hypixel stats',
    async execute(message: any, args: any, Bot: any) {
        const config = Bot.config;

        const usedAlias = message.content.slice(config.prefix.length).toLowerCase().split(' ')[0];

        const mentions = message.mentions.members.array();

        // ? If no username is given
        if (args.length === 0) {
            Bot.errorMessage(message, {
                title: 'Verification failed. You must specify your username',
                description: 'Please specify your Minecraft username',
                fields: [
                    {
                        name: 'Usage:',
                        value: `${config.prefix}${usedAlias} ign`,
                    },
                ],
            });
            return;
        }

        const verifyName = mentions.length === 0 ? args[0] : args[1];
        const verifyMember = mentions.length === 0 ? message.member : mentions[0];

        if (mentions[0]) {
            const ranks = require('../files/ranks.json');
            const has = Object.values(ranks.staff).some((rank) => message.member.roles.cache.some((role: any) => role.id === rank));
            if (!has) {
                Bot.errorMessage(message, {
                    title: 'Only staff can verify other members',
                    description: 'You have no permission to run the command in this way',
                    fields: [
                        {
                            name: 'Usage:',
                            value: `${config.prefix}${usedAlias} ign`,
                        },
                    ],
                });
                return;
            }
        }

        const getUser = (message: any, verify: any, config: any, command: any) => {
            try {
                return new User(message, verify, config, command);
            } catch (error) {
                Bot.errorMessage(message, error);
                return;
            }
        };

        const fetchMojang = async (username: any) => {
            try {
                return await user.fetchMojang(username);
            } catch (error) {
                Bot.errorMessage(message, error);
                return;
            }
        };

        const fetchHypixel = async (UUID: any) => {
            try {
                return await user.fetchHypixel(UUID);
            } catch (error) {
                Bot.errorMessage(message, error);
                return;
            }
        };

        // ? Instanciate user
        const user = getUser(message, {player: verifyName, member: verifyMember}, config, this);

        // ? Fetch Api data
        const mojangData = await fetchMojang(verifyName);

        const hypixelData = await fetchHypixel(mojangData.id);

        const player = hypixelData.player;
        const member = message.member;

        try {
            await user.valid(player);
        } catch (error) {
            Bot.errorMessage(message, error);
            return;
        }

        // ? Remove roles
        try {
            const toRemove = user.getRoles(['prestige', 'fkdr']);
            await user.removeRoles(toRemove);
        } catch (error) {
            Bot.errorMessage(message, error);
        }

        // ? Add roles
        try {
            const prestige = user.getPrestige(player);
            const fkdr = user.getFkdr(player);
            await user.addRoles([prestige, fkdr]);
        } catch (error) {
            Bot.errorMessage(message, error);
        }

        // ? Set nickname if its different from the current one
        try {
            const positions = user.getRoles(['staff']);
            const nickname = user.getNickname(positions, player);
            if (member.nickname !== nickname) await user.setNickname(nickname);
        } catch (error) {
            Bot.errorMessage(message, error);
        }

        // $ On complete

        Bot.successMessage(message, {
            title: `${usedAlias === 'verify' ? 'Verification' : 'Update'} complete!`,
            description: `You can update your stats by running \n\`${config.prefix}update ign\``,
        });
    },
};
