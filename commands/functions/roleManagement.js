const ranks = require('../../files/ranks.json');

const findRoles = (member, types) => {
    if (!member || !types) return console.error("findRoles requires 2 arguements: findRoles(member, ['type', 'type'])");

    const returnRoleID = (list, type) => {
        return list.map((item, key) => {
            const name = Object.keys(ranks[type])[key];
            const id = type === 'prestige' ? list[key].id : list[key];
            if (!member.roles.cache.has(id)) return;

            return {name, id, type: type.toUpperCase()};
        });
    };

    return types
        .map((type) => {
            const exists = Object.keys(ranks).find((name) => name === type);
            if (!exists) return console.error(`Type can only be: ${Object.keys(ranks)}`);

            const list = Object.values(ranks[type]);
            return returnRoleID(list, type);
        })
        .flat()
        .filter((i) => i);
};

const roleMatching = (player) => {
    if (!player) return console.error('roleMatching requires the player arguement');

    const list = ranks['prestige'];
    const level = player.achievements.bedwars_level;

    const found = [];

    for (const rank in list) if (level > list[rank].level) found.push(list[rank]);

    const levels = found.map((item) => item.level);
    const highest = Math.max.apply(null, levels);

    const name = Object.keys(list).find((key) => list[key].level === highest);
    const id = ranks['prestige'][name].id;

    return {name, id};
};

const fkdrMatching = (player) => {
    if (!player) return console.error('fkdrMatching requires the player arguement');

    const userFKDR = player.stats.Bedwars.final_kills_bedwars / player.stats.Bedwars.final_deaths_bedwars;
    const round = Math.floor(userFKDR * 10) / 10;
    const list = ranks['fkdr'];

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
            const name = `${Math.floor(Math.floor(userFKDR * 10) / 50) * 5} FKDR`;
            const id = list[name];
            return {name, id};
        }
        if (userFKDR >= 10) {
            const name = `${Math.floor(Math.floor(userFKDR * 10) / 20) * 2} FKDR`;
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

const getNickname = (positions, player) => {
    const getIcon = (level) => (level < 1000 ? '✫' : level < 2000 ? '✪' : '✰');
    const level = player.achievements.bedwars_level;
    const name = player.displayname;
    const star = getIcon(level);

    const position = positions.length !== 0 ? positions[0].name : `${star}${level}`;
    return `[${position}] ${name}`;
};

module.exports = {
    findRoles,
    roleMatching,
    getNickname,
    fkdrMatching,
};
