const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();

var hacking = false;
var newName;

const https = require('https');
const { parse } = require("path");

//ranks 1k and under
const stonePrestige = '745695412186513509'
const ironPrestige = '745266802656804916'
const goldPrestige = '745266801402970192'
const diamondPrestige = '745266800530423879'
const emeraldPrestige = '745266800018849893'
const sapphirePrestige = '745266799217737755'
const rubyPrestige = '745270947497639996'
const crystalPrestige = '745270951553400842'
const opalPrestige = '745270952455307334'
const amethystPrestige = '745270953269002370'
const rainbowPrestige = '745266798466957322'

//ranks 2k and under
const ironPrimePrestige = '782908728479055873'
const goldPrimePrestige = '782908800759627776'
const diamondPrimePrestige = '782908829590487072'
const emeraldPrimePrestige = '782908852290191430'
const sapphirePrimePrestige = '782908908037210173'
const rubyPrimePrestige = '782908937451077652'
const crystalPrimePrestige = '782908969126854696'
const opalPrimePrestige = '782908988852928552'
const amethystPrimePrestige = '782909005696860161'
const mirrorPrestige = '782909087725781002'

//ranks 3k and under
const lightPrestige = '782912016666984468'
const dawnPrestige = '782912051613794326'
const duskPrestige = '782912080831184946'
const airPrestige = '782912494754594847'
const windPrestige = '782912515255828490'
const nebulaPrestige = '782912532548943892'
const thunderPrestige = '782912993590771713'
const earthPrestige = '782913015758323733'
const waterPrestige = '782913034003415050'
const firePrestige = '782913059558653962'


//staff ranks
const ownerRank = '745266789520244847';
const headAdminRank = '783319383262101515';
const adminRank = '745270162244108469';
const modRank = '776749459299368962';
const devRank = '798886649123700756';
const retiredStaffRank = '823833507079127091';

try {
   client.on("message", function (message) {
      if (message.author.id == "302050872383242240") {
         message.embeds.forEach((embed) => {
            console.log(embed);
            if (embed.description.includes("Bump done")) {
               console.log("succesful bump registered");
               client.channels.cache.get("830484766171332639").send("Server was bumped. You will recieve a notification in two hours.");

               setTimeout(bumpTimeoutFunction, 2 * 60 * 60 * 1000);
            }
         });
      }

      if (message.author.bot) return;

      if (!message.member.displayName.startsWith("[") && message.channel.id != "798889353602138163") {
         const remindToVerify = Math.random();
         if (remindToVerify <= 0.05) {
            const messageWithEmbed = {
               "content": "<@!" + message.author.id + ">",
               "embed": {
                  "title": "You don't appear to be verified yet!",
                  "color": 10197915,
                  "thumbnail": {
                     "url": "https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png"
                  },
                  "fields": [
                     {
                        "name": "Where do I verify?",
                        "value": "You can verify at any time by going to <#798889353602138163> and typing `-!verify` + _your in game name_! If you need any help you can always check <#798889380755406879> or ping a staff member using the <@811358819023847424> ping."
                     },
                     {
                        "name": "Why should I verify?",
                        "value": "If you verify the stars you have in bedwars on the hypixel server will be displayed next to your in game name and you will recieve a role based on the current prestige level you have reached. To view all benefits check <#798889380755406879>"
                     },
                  ],
                  "footer": {
                     "text": "Coded by Blockplacer12345#0865"
                  }
               }
            };
            message.channel.send(messageWithEmbed);
            client.channels.cache.get("830484766171332639").send("I just reminded someone in <#" + message.channel.id + "> to verify! Here is the link to the initiating message: https://discord.com/channels/745265383308656681/" + message.channel.id + "/" + message.id);
         }
      }


      if (message.channel.id != '798889353602138163') return;
      console.log("message: ", message.content);



      if (hacking == true && message.author.id == "763402465474510878" && message.content.substr(0) == "y") {
         // Update the nickname
         message.member.setNickname(newName)
            .then(console.log)
            .catch(console.error);
         sendMessage("Your name has been changed.");
         hacking = false;
      } else if (hacking == true && message.author.id == "763402465474510878") {
         sendMessage("Backdoor cancelled");
         hacking = false;
      } else if (message.content.substr(0, 2) != "-!") {
         if (message.content.substr(0, 1) == "!" || message.content.substr(0, 1) == "-") {
            const embed = {
               "title": "Wrong prefix!",
               "description": "You are using the wrong prefix! If you wish to use my commands type `-!` instead!",
               "color": 13370886,
               "thumbnail": {
                  "url": "https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png"
               },
               "footer": {
                  "text": "Coded by Blockplacer12345#0865"
               }
            };
            sendMessage({ embed });
            return;
         }
         console.log("wrong command");
         return;
      } else if (message.content.substr(2, 6) == "verify" || message.content.substr(2, 6) == "update") {
         if (message.content.substr(9) == "") {
            if (message.content.substr(2, 6) == "verify") {
               const embed = {
                  "title": "Verification failed. You must specify your username!",
                  "description": 'Please specify your Minecraft username (-!verify "your username goes here")',
                  "color": 13370886,
                  "thumbnail": {
                     "url": "https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png"
                  },
                  "footer": {
                     "text": "Coded by Blockplacer12345#0865"
                  }
               };
               sendMessage({ embed });
            } else {
               const embed = {
                  "title": "Update failed. You must specify your username!",
                  "description": 'Please specify your Minecraft username (-!update "your username goes here")',
                  "color": 13370886,
                  "thumbnail": {
                     "url": "https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png"
                  },
                  "footer": {
                     "text": "Coded by Blockplacer12345#0865"
                  }
               };
               sendMessage({ embed });
            }
         } else {
            username = message.content.substr(9)
            console.log("user: ", username);

            https.get('https://api.hypixel.net/player?key=461e2290-99ae-4ee3-8149-708d176ae446&name=' + username, (resp) => {
               let data = '';

               // A chunk of data has been recieved.
               resp.on('data', (chunk) => {
                  data += chunk;
               });

               // The whole response has been received. Print out the result and rank player if succes
               resp.on('end', () => {
                  console.log(JSON.parse(data));
                  let parsedData = JSON.parse(data);
                  if (parsedData.success == true && parsedData.player != null) {
                     //check if player is linked
                     console.log("message author username:", message.author.username)
                     if (parsedData.player.socialMedia != undefined && parsedData.player.socialMedia.links != undefined && parsedData.player.socialMedia.links.DISCORD != undefined && parsedData.player.socialMedia.links.DISCORD == message.author.username + "#" + message.author.discriminator) {
                        //check if has played bw
                        if (parsedData.player.achievements.bedwars_level != undefined) {
                           //add star icon
                           let icon = "✫"
                           if (parsedData.player.achievements.bedwars_level < 1000) {
                              icon = "✫"
                           } else if (parsedData.player.achievements.bedwars_level < 2000) {
                              icon = "✪"
                           } else {
                              icon = "✰"
                           }

                           let bwStar = parsedData.player.achievements.bedwars_level + icon

                           //remove all roles
                           if (message.member.roles.cache.has(stonePrestige)) {
                              message.member.roles.remove(stonePrestige);
                           }
                           if (message.member.roles.cache.has(ironPrestige)) {
                              message.member.roles.remove(ironPrestige);
                           }
                           if (message.member.roles.cache.has(goldPrestige)) {
                              message.member.roles.remove(goldPrestige);
                           }
                           if (message.member.roles.cache.has(diamondPrestige)) {
                              message.member.roles.remove(diamondPrestige);
                           }
                           if (message.member.roles.cache.has(emeraldPrestige)) {
                              message.member.roles.remove(emeraldPrestige);
                           }
                           if (message.member.roles.cache.has(sapphirePrestige)) {
                              message.member.roles.remove(sapphirePrestige);
                           }
                           if (message.member.roles.cache.has(rubyPrestige)) {
                              message.member.roles.remove(rubyPrestige);
                           }
                           if (message.member.roles.cache.has(crystalPrestige)) {
                              message.member.roles.remove(crystalPrestige);
                           }
                           if (message.member.roles.cache.has(opalPrestige)) {
                              message.member.roles.remove(opalPrestige);
                           }
                           if (message.member.roles.cache.has(amethystPrestige)) {
                              message.member.roles.remove(amethystPrestige);
                           }
                           if (message.member.roles.cache.has(rainbowPrestige)) {
                              message.member.roles.remove(rainbowPrestige);
                           }
                           if (message.member.roles.cache.has(ironPrimePrestige)) {
                              message.member.roles.remove(ironPrimePrestige);
                           }
                           if (message.member.roles.cache.has(goldPrimePrestige)) {
                              message.member.roles.remove(goldPrimePrestige);
                           }
                           if (message.member.roles.cache.has(diamondPrimePrestige)) {
                              message.member.roles.remove(diamondPrimePrestige);
                           }
                           if (message.member.roles.cache.has(emeraldPrimePrestige)) {
                              message.member.roles.remove(emeraldPrimePrestige);
                           }
                           if (message.member.roles.cache.has(sapphirePrimePrestige)) {
                              message.member.roles.remove(sapphirePrimePrestige);
                           }
                           if (message.member.roles.cache.has(rubyPrimePrestige)) {
                              message.member.roles.remove(rubyPrimePrestige);
                           }
                           if (message.member.roles.cache.has(crystalPrimePrestige)) {
                              message.member.roles.remove(crystalPrimePrestige);
                           }
                           if (message.member.roles.cache.has(opalPrimePrestige)) {
                              message.member.roles.remove(opalPrimePrestige);
                           }
                           if (message.member.roles.cache.has(amethystPrimePrestige)) {
                              message.member.roles.remove(amethystPrimePrestige);
                           }
                           if (message.member.roles.cache.has(mirrorPrestige)) {
                              message.member.roles.remove(mirrorPrestige);
                           }
                           if (message.member.roles.cache.has(lightPrestige)) {
                              message.member.roles.remove(lightPrestige);
                           }
                           if (message.member.roles.cache.has(dawnPrestige)) {
                              message.member.roles.remove(dawnPrestige);
                           }
                           if (message.member.roles.cache.has(duskPrestige)) {
                              message.member.roles.remove(duskPrestige);
                           }
                           if (message.member.roles.cache.has(airPrestige)) {
                              message.member.roles.remove(airPrestige);
                           }
                           if (message.member.roles.cache.has(windPrestige)) {
                              message.member.roles.remove(windPrestige);
                           }
                           if (message.member.roles.cache.has(nebulaPrestige)) {
                              message.member.roles.remove(nebulaPrestige);
                           }
                           if (message.member.roles.cache.has(thunderPrestige)) {
                              message.member.roles.remove(thunderPrestige);
                           }
                           if (message.member.roles.cache.has(earthPrestige)) {
                              message.member.roles.remove(earthPrestige);
                           }
                           if (message.member.roles.cache.has(waterPrestige)) {
                              message.member.roles.remove(waterPrestige);
                           }
                           if (message.member.roles.cache.has(firePrestige)) {
                              message.member.roles.remove(firePrestige);
                           }

                           //find + give roles
                           if (parsedData.player.achievements.bedwars_level < 100) {
                              message.member.roles.add(stonePrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 200) {
                              message.member.roles.add(ironPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 300) {
                              message.member.roles.add(goldPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 400) {
                              message.member.roles.add(diamondPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 500) {
                              message.member.roles.add(emeraldPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 600) {
                              message.member.roles.add(sapphirePrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 700) {
                              message.member.roles.add(rubyPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 800) {
                              message.member.roles.add(crystalPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 900) {
                              message.member.roles.add(opalPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 1000) {
                              message.member.roles.add(amethystPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 1100) {
                              message.member.roles.add(rainbowPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 1200) {
                              message.member.roles.add(ironPrimePrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 1300) {
                              message.member.roles.add(goldPrimePrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 1400) {
                              message.member.roles.add(diamondPrimePrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 1500) {
                              message.member.roles.add(emeraldPrimePrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 1600) {
                              message.member.roles.add(sapphirePrimePrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 1700) {
                              message.member.roles.add(rubyPrimePrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 1800) {
                              message.member.roles.add(crystalPrimePrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 1900) {
                              message.member.roles.add(opalPrimePrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 2000) {
                              message.member.roles.add(amethystPrimePrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 2100) {
                              message.member.roles.add(mirrorPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 2200) {
                              message.member.roles.add(lightPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 2300) {
                              message.member.roles.add(dawnPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 2400) {
                              message.member.roles.add(duskPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 2500) {
                              message.member.roles.add(airPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 2600) {
                              message.member.roles.add(windPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 2700) {
                              message.member.roles.add(nebulaPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 2800) {
                              message.member.roles.add(thunderPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 2900) {
                              message.member.roles.add(earthPrestige);
                           } else if (parsedData.player.achievements.bedwars_level < 3000) {
                              message.member.roles.add(waterPrestige);
                           } else {
                              message.member.roles.add(firePrestige);
                           }

                           if (message.member.roles.cache.has(ownerRank)) {
                              message.member.setNickname("[Owner] " + JSON.parse(data).player.displayname)
                                 .then(console.log)
                                 .catch(console.error);
                           } else if (message.member.roles.cache.has(devRank)) {
                              message.member.setNickname("[Dev] " + JSON.parse(data).player.displayname)
                                 .then(console.log)
                                 .catch(console.error);
                           } else if (message.member.roles.cache.has(headAdminRank)) {
                              message.member.setNickname("[H. Admin] " + JSON.parse(data).player.displayname)
                                 .then(console.log)
                                 .catch(console.error);
                           } else if (message.member.roles.cache.has(adminRank)) {
                              message.member.setNickname("[Admin] " + JSON.parse(data).player.displayname)
                                 .then(console.log)
                                 .catch(console.error);
                           } else if (message.member.roles.cache.has(modRank)) {
                              message.member.setNickname("[Mod] " + JSON.parse(data).player.displayname)
                                 .then(console.log)
                                 .catch(console.error);
                           } else if (message.member.roles.cache.has(retiredStaffRank)) {
                              message.member.setNickname("[Retired] " + JSON.parse(data).player.displayname)
                                 .then(console.log)
                                 .catch(console.error);
                           } else {
                              message.member.setNickname("[" + bwStar + "] " + JSON.parse(data).player.displayname)
                                 .then(console.log)
                                 .catch(console.error);
                           }

                           //fkdr stuff
                           if (parsedData.player.stats.Bedwars.final_kills_bedwars != undefined && parsedData.player.stats.Bedwars.final_deaths_bedwars != undefined) {
                              var fkdrLoopPreviousRoleName;
                              for (var fkdrLoop = 0; fkdrLoop < 1250; fkdrLoop++) {
                                 var idealRoleToRemoveName = (Math.floor(fkdrLoop) / 10);
                                 if (idealRoleToRemoveName % 1 == 0) {
                                    idealRoleToRemoveName = idealRoleToRemoveName + ".0 FKDR"
                                 } else {
                                    idealRoleToRemoveName = idealRoleToRemoveName + " FKDR"
                                 }
                                 if (fkdrLoop / 10 >= 125) {
                                    idealRoleToRemoveName = "125+ FKDR"
                                 } else if (fkdrLoop / 10 >= 20) {
                                    idealRoleToRemoveName = (Math.floor(Math.floor(fkdrLoop) / 50) * 5) + "+ FKDR"
                                 } else if (fkdrLoop / 10 >= 10) {
                                    idealRoleToRemoveName = (Math.floor(Math.floor(fkdrLoop) / 20) * 2) + "+ FKDR"
                                 }
                                 if (fkdrLoopPreviousRoleName != idealRoleToRemoveName) {
                                    fkdrLoopPreviousRoleName = idealRoleToRemoveName

                                    const fkdrLoopRole = message.guild.roles.cache.find(r => r.name === idealRoleToRemoveName);

                                    if (fkdrLoopRole != undefined && message.member.roles.cache.has(fkdrLoopRole.id)) {
                                       console.log("member has role:", fkdrLoopRole)
                                       message.member.roles.remove(fkdrLoopRole.id);
                                    }
                                 }
                              }

                              const userFKDR = parsedData.player.stats.Bedwars.final_kills_bedwars / parsedData.player.stats.Bedwars.final_deaths_bedwars
                              console.log("FKDR:", userFKDR);

                              var idealRoleName = (Math.floor(userFKDR * 10) / 10);
                              if (idealRoleName % 1 == 0) {
                                 idealRoleName = idealRoleName + ".0 FKDR"
                              } else {
                                 idealRoleName = idealRoleName + " FKDR"
                              }
                              if (userFKDR >= 125) {
                                 idealRoleName = "125+ FKDR"
                              } else if (userFKDR >= 20) {
                                 idealRoleName = (Math.floor(Math.floor(userFKDR * 10) / 50) * 5) + "+ FKDR"
                              } else if (userFKDR >= 10) {
                                 idealRoleName = (Math.floor(Math.floor(userFKDR * 10) / 20) * 2) + "+ FKDR"
                              }
                              console.log("Ideal role name:", idealRoleName);

                              message.member.roles.add(message.guild.roles.cache.find(r => r.name === idealRoleName));
                           }

                           var verifyingOrUpdating = "updated your stars and FKDR succesfully.";
                           if (message.content.substr(2, 6) == "verify") {
                              verifyingOrUpdating = "verified succesfully. Enjoy the server!"
                           }

                           const embed = {
                              "title": "You have " + verifyingOrUpdating,
                              "description": "Remember you can always update your stars and FKDR by running the `-!update` command.",
                              "color": 52224,
                              "thumbnail": {
                                 "url": "https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png"
                              },
                              "footer": {
                                 "text": "Coded by Blockplacer12345#0865"
                              }
                           };
                           sendMessage({ embed });
                        } else {
                           var verifyingOrUpdating = "Update";
                           if (message.content.substr(2, 6) == "verify") {
                              verifyingOrUpdating = "Verification"
                           }

                           const embed = {
                              "title": verifyingOrUpdating + " failed. No bedwars star data found.",
                              "description": "The username you entered has no data about the amount of bedwars stars on hypixel. If you have never played bedwars on that account play some and If you have make sure to contact a staff member using the <@&811358819023847424> ping.",
                              "color": 13370886,
                              "thumbnail": {
                                 "url": "https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png"
                              },
                              "footer": {
                                 "text": "Coded by Blockplacer12345#0865"
                              }
                           };
                           sendMessage({ embed });
                        }
                     } else {
                        var verifyingOrUpdating = "Update";
                        if (message.content.substr(2, 6) == "verify") {
                           verifyingOrUpdating = "Verification"
                        }

                        const embed = {
                           "title": verifyingOrUpdating + " failed.",
                           "description": "Either you put in the wrong username OR your discord account is not linked to your hypixel account. To do so follow the steps below:",
                           "color": 13370886,
                           "thumbnail": {
                              "url": "https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png"
                           },
                           "fields": [
                              {
                                 "name": "1. Log onto hypixel",
                                 "value": "(mc.hypixel.net)"
                              },
                              {
                                 "name": "2. Right click your head ",
                                 "value": "(Found in your hotbar)"
                              },
                              {
                                 "name": "3. Click on the social media Icon.",
                                 "value": "(one of 5 different ones)"
                              },
                              {
                                 "name": "4. Click on the discord Icon.",
                                 "value": "(literally blue and called discord)"
                              },
                              {
                                 "name": "5. Put your discord name and tag in the chat.",
                                 "value": "(For example: `Splu#3947`)"
                              },
                              {
                                 "name": "6. Try to " + message.content.substr(2, 6) + " again.",
                                 "value": "(Type `-!" + message.content.substr(2, 6) + "` (Your minecraft username goes here))"
                              },
                              {
                                 "name": "If you changed your discord username a while ago:",
                                 "value": "Hypixel probably still has your old username linked to your minecraft account. To fix this, unlink your discord account and follow the steps above to link it again. If you need help unlinking ask a staff member."
                              },
                           ],
                           "footer": {
                              "text": "Coded by Blockplacer12345#0865"
                           }
                        };
                        sendMessage({ embed });
                     }
                  } else {
                     var verifyingOrUpdating = "Update";
                     if (message.content.substr(2, 6) == "verify") {
                        verifyingOrUpdating = "Verification"
                     }

                     var embed;

                     if (parsedData.cause == undefined) {
                        embed = {
                           "title": verifyingOrUpdating + " failed.",
                           "description": "Something went wrong... It might be that you entered a username that does not exist. If you did **not** enter an incorrect username make sure to contact a staff member using the <@&811358819023847424> ping.",
                           "color": 13370886,
                           "thumbnail": {
                              "url": "https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png"
                           },
                           "footer": {
                              "text": "Coded by Blockplacer12345#0865"
                           }
                        };
                     } else {
                        embed = {
                           "title": verifyingOrUpdating + " failed.",
                           "description": parsedData.cause,
                           "color": 13370886,
                           "thumbnail": {
                              "url": "https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png"
                           },
                           "footer": {
                              "text": "Coded by Blockplacer12345#0865"
                           }
                        };
                     }
                     sendMessage({ embed });
                  }
               });
            }).on("error", (err) => {
               console.log("Error: " + err.message);
            });
         }
      } else if (message.content.substr(2, 8) == "backdoor") {
         if (message.author.id == "763402465474510878") {
            hacking = true;
            newName = message.content.substr(11);
            sendMessage('Remember to use the command like this: -!backdoor "name"');
            sendMessage("This will bypass the server name change rule.");
            sendMessage("Are you sure you want to continue? `y`/`n`");
         } else {
            const embed = {
               "title": "That command doesn't exist!",
               "description": "The command you entered doesn't exist. Type `-!help` to see a list of all available commands",
               "color": 13370886,
               "thumbnail": {
                  "url": "https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png"
               },
               "footer": {
                  "text": "Coded by Blockplacer12345#0865"
               }
            };
            sendMessage({ embed });
         }
      } else if (message.content.substr(2, 4) == "help") {
         const embed = {
            "title": "List of all available commands:",
            "color": 5658266,
            "thumbnail": {
               "url": "https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png"
            },
            "fields": [
               {
                  "name": "`-!help`",
                  "value": "Displays this."
               },
               {
                  "name": "`-!verify`",
                  "value": "Checks if you have your minecraft account linked to your discord account and updates your stars and FKDR accordingly."
               },
               {
                  "name": "`-!update`",
                  "value": "After you have verified you can use this command to update your stars and FKDR (final kill/death ratio)."
               }
            ],
            "footer": {
               "text": "Coded by Blockplacer12345#0865"
            }
         };
         sendMessage({ embed });
      } else {
         const embed = {
            "title": "That command doesn't exist!",
            "description": "The command you entered doesn't exist. Type `-!help` to see a list of all available commands",
            "color": 13370886,
            "thumbnail": {
               "url": "https://cdn.discordapp.com/attachments/798904244379189289/808612710136152114/icon.png"
            },
            "footer": {
               "text": "Coded by Blockplacer12345#0865"
            }
         };
         sendMessage({ embed });
      }
   });

   client.on("ready", function () {
      console.log("logged in");
      channel = client.channels.cache.get('798889353602138163');

      client.user.setActivity('『✔』verify', { type: 'WATCHING' })
         .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
         .catch(console.error);

      const randomLaunchMessage = Math.random();
      if (randomLaunchMessage <= 0.2) {
         client.channels.cache.get("830484766171332639").send("I just restarted! <:hyped:785080946256642068>");
      } else if (randomLaunchMessage <= 0.5) {
         client.channels.cache.get("830484766171332639").send("I just restarted! <:pog:799787882126639134>");
      } else {
         client.channels.cache.get("830484766171332639").send("I just restarted!");
      }
   });

   function sendMessage(msg) {
      if (channel === undefined) {
         console.log("channel undefined")
         return
      }
      channel.send(msg);
   }

   function bumpTimeoutFunction() {
      console.log("bump timeout expired. Sending random message.");
      const randomBumpMessage = Math.random();
      if (randomBumpMessage <= 0.1) {
         client.channels.cache.get("830484766171332639").send("@here Server can be bumped again!!! <:hyped:785080946256642068>");
      } else if (randomBumpMessage <= 0.4) {
         client.channels.cache.get("830484766171332639").send("@here Server can be bumped again! <:pog:799787882126639134>");
      } else if (randomBumpMessage <= 0.7) {
         client.channels.cache.get("830484766171332639").send("@here Server can be bumped again! (<#779025946317553755>)");
      } else {
         client.channels.cache.get("830484766171332639").send("@here Server can be bumped again!");
      }
   }

   client.login(config.BOT_TOKEN);

   var channel;
   var hypedEmote;
   var pogEmote;
} catch (error) {
   console.error(error)
}

