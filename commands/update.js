const {User} = require('./classes/User');

// # Command

module.exports = {
    name: 'update',
    description: 'Update your Hypixel profile on Discord',
    async execute(message, args, data) {
        // ? No username is given
        if (args.length === 0) {
            errorMessage(message, {
                title: 'Updating failed. You must specify your username',
                description: 'Please specify your Minecraft username (-!verify "your username goes here")',
                fields: [
                    {
                        name: 'Usage:',
                        value: `${data.config.prefix}${this.name} ign`,
                    },
                ],
            });
            return;
        }

        // ? Instanciate user
        const user = new User(message, args, data, this);

        // ? Fetch Api data
        const mojangData = await user.fetchMojang(args[0]);
        const hypixelData = await user.fetchHypixel(mojangData.id);

        const player = hypixelData.player;
        const member = message.member;

        try {
            await user.valid(player);
        } catch (error) {
            errorMessage(message, error);
            return;
        }

        const toRemove = user.getRoles(['prestige', 'fkdr']);

        console.log(toRemove);

        /// ? Remove roles
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
            title: 'Updating complete!',
            description: `You're now verified, you can update your stats by running \`${data.config.prefix}update ign\``,
        });
    },
};

function errorMessage(message, error) {
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
