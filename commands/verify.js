module.exports = {
    name: 'verify',
    description: 'Verify your Hypixel  profile with Discord',
    async execute(message, args, data) {
        const fetch = require('node-fetch');

        // ? No username is given
        if (args.length === 0) {
            errorMessage(message, {
                title: 'Verification failed. You must specify your username',
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

        const username = args[0];

        const mojangAPI = await fetch(`http://api.mojang.com/users/profiles/minecraft/${username}`);
        const mojangData = await mojangAPI.json();

        const response = await fetch(`http://api.hypixel.net/player?key=${process.env.HYPIXEL_API_KEY}&uuid=${mojangData.id}`);
        const json = await response.json();
        const player = json.player;
        const member = message.member;

        // ? If api request failed
        if (!json.success) {
            console.log(json);
            errorMessage(message, {
                title: 'Verification failed. API Request failed',
                description: 'Please ask one of the developers for help',
                fields: [
                    {
                        name: 'Cause',
                        value: json.cause || 'Unknown',
                    },
                ],
            });
            return;
        }

        // ? Unlinked account
        if (!player.socialMedia?.links?.DISCORD) {
            errorMessage(message, {
                title: "Verification failed. This account isn't yet linked to a Discord account",
                description: 'Make sure you have linked your Discord and Minecraft account on the Hypixel website',
            });
            return;
        }

        // ? Incorrect discord
        if (player.socialMedia?.links?.DISCORD !== message.author.tag) {
            errorMessage(message, {
                title: 'Verification failed. The Discord account was incorrect',
                description: 'The Discord account linked on the Hypixel website is different from yours',
            });
            return;
        }

        // ? If no bedwars level was found
        if (!player.achievements.bedwars_level) {
            errorMessage(message, {
                title: "Verification failed. We couldn't find any Bedwars stats for this account",
                description: 'Make sure you at least are level 1 in Bedwars on the Hypixel server',
            });
            return;
        }

        const {findRoles, roleMatching, getNickname, fkdrMatching} = require('./functions/roleManagement');

        // ? Remove existing roles
        const statsRoles = findRoles(member, ['prestige', 'fkdr']);

        statsRoles.forEach((role) => {
            member.roles
                .remove(role.id)
                .catch((error) => {
                    issues++;
                    issueMessage(message, {
                        title: `To remove your old role please run \`${data.config.prefix}update ign\` after a few minutes`,
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
                    });
                })
                .then(() => console.log(`Removed ${role.name} from ${member.id} | ${member.user.tag}`));
        });

        // ? Get staff position
        const positions = findRoles(member, ['staff']);

        // ? Get player data
        const nickname = getNickname(positions, player);
        const prestige = roleMatching(player);
        const fkdr = fkdrMatching(player);
        let issues = 0;

        // ? Apply player data
        [prestige, fkdr].forEach((role) => {
            member.roles
                .add(role.id)
                .catch((error) => {
                    issues++;
                    issueMessage(message, {
                        title: 'Failed to add role',
                        description: `To get your role please run \`${data.config.prefix}update ign\` after a few minutes`,
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
                    });
                })
                .then(() => console.log(`Added ${role.name} to ${member.id} | ${member.user.tag}`));
        });

        // ? Set nickname
        await member
            .setNickname(nickname)
            .catch((error) => {
                issues++;
                issueMessage(message, {
                    title: 'Failed to set nickname',
                    description: `To get your nickname please run \`${data.config.prefix}update ign\` after a few minutes`,
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
                });
            })
            .then(() => console.log(`Set nickname ${nickname} to ${member.id} | ${member.user.tag}`));

        // ? Verification complete
        successMessage(message, {
            title: 'Verification complete!',
            description: `You're now verified, you can update your stats by running ${data.config.prefix}update \`ign\``,
            fields: issues > 0 ? [{name: 'Issues', value: issues}] : [],
        });
    },
};

function errorMessage(message, error) {
    const embed = {
        title: error.title,
        description: error.description,
        color: error.color ?? 13370886,
        thumbnail: {
            url: error.thumbnail ?? 'https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png',
        },
        fields: error.fields ?? [],
        footer: {
            text: error.footer ?? 'Coded by Blockplacer12345#0865',
        },
    };
    message.channel.send({embed});
}

function issueMessage(message, issue) {
    const embed = {
        title: issue.title,
        description: issue.description,
        color: issue.color ?? 13370886,
        thumbnail: {
            url: issue.thumbnail ?? 'https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png',
        },
        fields: issue.fields ?? [],
        footer: {
            text: issue.footer ?? 'Coded by Blockplacer12345#0865',
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
            text: content.footer ?? 'Coded by Blockplacer12345#0865',
        },
    };
    message.channel.send({embed});
}

return;

//                             const embed = {
//                                 title: 'You have ' + verifyingOrUpdating,
//                                 description: 'Remember you can always update your stars and FKDR by running the `-!update` command.',
//                                 color: 52224,
//                                 thumbnail: {
//                                     url: 'https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png',
//                                 },
//                                 footer: {
//                                     text: 'Coded by Blockplacer12345#0865',
//                                 },
//                             };
//                             sendMessage({embed});
//                         } else {
//                             var verifyingOrUpdating = 'Update';
//                             if (message.content.substr(2, 6) == 'verify') {
//                                 verifyingOrUpdating = 'Verification';
//                             }

//                             const embed = {
//                                 title: verifyingOrUpdating + ' failed. No bedwars star data found.',
//                                 description: 'The username you entered has no data about the amount of bedwars stars on hypixel. If you have never played bedwars on that account play some and If you have make sure to contact a staff member using the <@&811358819023847424> ping.',
//                                 color: 13370886,
//                                 thumbnail: {
//                                     url: 'https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png',
//                                 },
//                                 footer: {
//                                     text: 'Coded by Blockplacer12345#0865',
//                                 },
//                             };
//                             sendMessage({embed});
//                         }
//                     } else {
//                         var verifyingOrUpdating = 'Update';
//                         if (message.content.substr(2, 6) == 'verify') {
//                             verifyingOrUpdating = 'Verification';
//                         }

//                         const embed = {
//                             title: verifyingOrUpdating + ' failed.',
//                             description: 'Either you put in the wrong username OR your discord account is not linked to your hypixel account. To do so follow the steps below:',
//                             color: 13370886,
//                             thumbnail: {
//                                 url: 'https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png',
//                             },
//                             fields: [
//                                 {
//                                     name: '1. Log onto hypixel',
//                                     value: '(mc.hypixel.net)',
//                                 },
//                                 {
//                                     name: '2. Right click your head ',
//                                     value: '(Found in your hotbar)',
//                                 },
//                                 {
//                                     name: '3. Click on the social media Icon.',
//                                     value: '(one of 5 different ones)',
//                                 },
//                                 {
//                                     name: '4. Click on the discord Icon.',
//                                     value: '(literally blue and called discord)',
//                                 },
//                                 {
//                                     name: '5. Put your discord name and tag in the chat.',
//                                     value: '(For example: `Splu#3947`)',
//                                 },
//                                 {
//                                     name: '6. Try to ' + message.content.substr(2, 6) + ' again.',
//                                     value: '(Type `-!' + message.content.substr(2, 6) + '` (Your minecraft username goes here))',
//                                 },
//                                 {
//                                     name: 'If you changed your discord username a while ago:',
//                                     value: 'Hypixel probably still has your old username linked to your minecraft account. To fix this, unlink your discord account and follow the steps above to link it again. If you need help unlinking ask a staff member.',
//                                 },
//                             ],
//                             footer: {
//                                 text: 'Coded by Blockplacer12345#0865',
//                             },
//                         };
//                         sendMessage({embed});
//                     }
//                 } else {
//                     var verifyingOrUpdating = 'Update';
//                     if (message.content.substr(2, 6) == 'verify') {
//                         verifyingOrUpdating = 'Verification';
//                     }

//                     var embed;

//                     if (parsedData.cause == undefined) {
//                         embed = {
//                             title: verifyingOrUpdating + ' failed.',
//                             description: 'Something went wrong... It might be that you entered a username that does not exist. If you did **not** enter an incorrect username make sure to contact a staff member using the <@&811358819023847424> ping.',
//                             color: 13370886,
//                             thumbnail: {
//                                 url: 'https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png',
//                             },
//                             footer: {
//                                 text: 'Coded by Blockplacer12345#0865',
//                             },
//                         };
//                     } else {
//                         embed = {
//                             title: verifyingOrUpdating + ' failed.',
//                             description: parsedData.cause,
//                             color: 13370886,
//                             thumbnail: {
//                                 url: 'https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png',
//                             },
//                             footer: {
//                                 text: 'Coded by Blockplacer12345#0865',
//                             },
//                         };
//                     }
//                     sendMessage({embed});
//                 }
//             });
//         })
//         .on('error', (err) => {
//             console.log('Error: ' + err.message);
//         });
// }
