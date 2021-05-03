const fetchRoles = async () => {
    const fs = require('fs');
    let list = {};

    const roles = await message.guild.roles.cache;
    roles.forEach((role) => {
        if (!role.name.includes('Prestige')) return;
        list[role.name] = role.id;
    });

    fs.writeFileSync('prestige-ids.json', JSON.stringify(list), 'utf-8');
};

module.exports = {
    fetchRoles,
};
