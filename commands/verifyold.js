

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
