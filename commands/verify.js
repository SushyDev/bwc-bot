const {User} = require('../classes/User');
module.exports = {
    name: 'verify',
    description: 'Gives FKDR and Prestige roles based on your Hypixel stats',
    async execute(message, args, config, Bot) {
        const usedAlias = message.content.slice(config.prefix.length).toLowerCase().split(' ')[0];

        // ? If no username is given
        if (args.length === 0) {
            throw new Error({
                title: 'Verification failed. You must specify your username',
                description: 'Please specify your Minecraft username',
                fields: [
                    {
                        name: 'Usage:',
                        value: `${config.prefix}${usedAlias} ign`,
                    },
                ],
            });
        }

        const getUser = (message, args, config, command) => {
            try {
                return new User(message, args, config, command);
            } catch (error) {
                Bot.errorMessage(message, error);
                throw new Error(error);
            }
        };

        const fetchMojang = async (username) => {
            try {
                return await user.fetchMojang(username);
            } catch (error) {
                Bot.errorMessage(message, error);
                throw new Error(error);
            }
        };

        const fetchHypixel = async (UUID) => {
            try {
                return await user.fetchHypixel(UUID);
            } catch (error) {
                Bot.errorMessage(message, error);
                throw new Error(error);
            }
        };

        // ? Instanciate user
        const user = getUser(message, args, config, this);

        // ? Fetch Api data
        const mojangData = await fetchMojang(args[0]);

        const hypixelData = await fetchHypixel(mojangData.id);

        const player = hypixelData.player;
        const member = message.member;

        try {
            await user.valid(player);
        } catch (error) {
            Bot.errorMessage(message, error);
            throw new Error(error);
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
