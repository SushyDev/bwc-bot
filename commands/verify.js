const {User} = require('./classes/User');

// # Command

module.exports = {
    name: 'verify',
    aliases: ['update'],
    description: 'Gives FKDR and Prestige roles based on your Hypixel stats',
    async execute(message, args, data) {
        const getUser = (message, args, data, command) => {
            try {
                return new User(message, args, data, command);
            } catch (error) {
                errorMessage(message, error);
                return;
            }
        };

        const fetchMojang = async (username) => {
            try {
                return await user.fetchMojang(username);
            } catch (error) {
                errorMessage(message, error);
                return;
            }
        };

        const fetchHypixel = async (UUID) => {
            try {
                return await user.fetchHypixel(UUID);
            } catch (error) {
                errorMessage(message, error);
                return;
            }
        };

        // ? Instanciate user
        const user = getUser(message, args, data, this);
        if (!user) return;

        // ? Fetch Api data
        const mojangData = await fetchMojang(args[0]);
        if (!mojangData) return;

        const hypixelData = await fetchHypixel(mojangData.id);
        if (!hypixelData) return;

        const player = hypixelData.player;
        const member = message.member;

        try {
            await user.valid(player);
        } catch (error) {
            errorMessage(message, error);
            return;
        }

        const toRemove = user.getRoles(['prestige', 'fkdr']);

        // ? Remove roles
        try {
            await user.removeRoles(toRemove);
        } catch (error) {
            errorMessage(message, error);
        }

        const prestige = user.getPrestige(player);
        const fkdr = user.getFkdr(player);

        // ? Add roles
        try {
            await user.addRoles([prestige, fkdr]);
        } catch (error) {
            errorMessage(message, error);
        }

        const positions = user.getRoles(['staff']);
        const nickname = user.getNickname(positions, player);

        // ? Set nickname if its different from the current one
        if (member.nickname !== nickname) {
            try {
                await user.setNickname(nickname);
            } catch (error) {
                errorMessage(message, error);
            }
        }

        // $ On complete
        successMessage(message, {
            title: 'Verification complete!',
            description: `You're now verified, you can update your stats by running \n\`${data.config.prefix}update ign\``,
        });
    },
};

function errorMessage(message, error) {
    if (!error.title) {
        console.error(error);
        return;
    }
    const embed = {
        title: error.title,
        description: error.description,
        color: error.color ?? '#ff0000',
        thumbnail: {
            url: error.thumbnail ?? 'https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png',
        },
        fields: error.fields ?? [],
        footer: {
            text: error.footer ?? `For ${message.member.user.tag}`,
        },
    };
    message.channel.send({embed});
}

function successMessage(message, content) {
    if (!content.title) {
        console.error(content);
        return;
    }
    const embed = {
        title: content.title,
        description: content.description,
        color: content.color ?? '#00ff00',
        thumbnail: {
            url: content.thumbnail ?? 'https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png',
        },
        fields: content.fields ?? [],
        footer: {
            text: content.footer ?? `For ${message.member.user.tag}`,
        },
    };
    message.channel.send({embed});
}
