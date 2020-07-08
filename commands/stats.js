const Client = require("fortnite");
const { get, set } = require("../services/redis");
const { fortniteTrackerAPIKey } = require("../config");
const fortnite = new Client(fortniteTrackerAPIKey);
const moment = require('moment');

const field = (name, value) => {
    return {
        name,
        value,
        inline: true
    }
}

const sumAcrossPlatforms = (stats, matchType, value) => {
    return Object.values(stats).reduce((wins, stat) => {
        if (stat[matchType]) {
            return wins + stat[matchType][value];
        } else {
            return wins;
        }
    }, 0);
}

const fetchStats = async username => {
    const gamePadStats = await fortnite.user(username, "gamepad");
    const kbmStats = await fortnite.user(username, "kbm");
    const touchStats = await fortnite.user(username, "touch");

    if (gamePadStats.code || kbmStats.code || touchStats.code) {
        throw new Error(`Couldn't find any stats for ${username}`);
    }

    const stats = {
        timestamp: Date.now(),
        gamePad: gamePadStats.stats,
        kbm: kbmStats.stats,
        touch: touchStats.stats,
    };

    await set(`${username}-stats`, JSON.stringify(stats));
    return stats;
}

module.exports = {
    name: "stats",
    description: "List out someone's fortnite stats `stats <epicusername>`",
    cooldown: 5,
    async execute(message, args) {
        const [username] = args;
        let stats;
        if (!username) {
            return message.author.send("Please supply a valid epic username");
        }
        // Check username stats in redis first
        try {
            stats = await get(`${username}-stats`);
            if (!stats) {
                message.channel.send(`Fetching fresh stats for ${username}`);
                stats = await fetchStats(username);
            } else {
                stats = JSON.parse(stats);
            }

            if (stats && moment(Number(stats.timestamp)).add(1, "hour").isBefore(moment())) {
                message.channel.send(`Fetching fresh stats for ${username}`);
                stats = await fetchStats(username);
            }
        } catch (e) {
            console.error(e);
            message.channel.send("Whoops, something went wrong trying to fetch stats");
        }

        message.channel.send({
            embed: {
                title: username,
                description: `has ${sumAcrossPlatforms(stats, "lifetime", "wins")} total wins.`,
                fields: [
                    field("Solo Wins", sumAcrossPlatforms(stats, "solo", "wins")),
                    field("Duo Wins", sumAcrossPlatforms(stats, "duo", "wins")),
                    field("Squads Wins", sumAcrossPlatforms(stats, "squad", "wins")),
                ],
            },
        });
    },
};
