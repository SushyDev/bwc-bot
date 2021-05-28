const {ModeratorInstance} = require('../classes/Moderator');

module.exports = {
    name: 'kill',
    aliases: ['shutdown'],
    description: 'List all commands',
    async execute(message: any, args: any, Bot: any) {
        const helper = new ModeratorInstance(message, this, Bot);

        const member = await helper.getMember(message.author.id);

        console.log(helper.isStaff(member));
    },
};
