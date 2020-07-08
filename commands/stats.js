const Client = require("fortnite");
const { get, set } = require("../services/redis");
const { MessageAttachment } = require('discord.js');
const { fortniteTrackerAPIKey } = require("../config");
const fortnite = new Client(fortniteTrackerAPIKey);
const moment = require('moment');
const Canvas = require("canvas");

const field = (name, value) => {
    return {
        name,
        value,
        inline: true
    }
}

const sumAcrossPlatforms = (platforms, matchType, value) => {
    return platforms.reduce((sum, stat) => {
        if (stat.stats[matchType]) {
            return sum + stat.stats[matchType][value];
        } else {
            return sum;
        }
    }, 0);
}

const fetchStats = async username => {
    const stats = {
        platforms: [],
        timestamp: Date.now()
    };
    try {
        const gamePadStats = await fortnite.user(username, "gamepad");
        if (!gamePadStats.code) {
            stats.platforms.push(gamePadStats);
        }
    } catch (e) {
        console.error(`Couldn't fetch gamePadStats for ${username}`);
    }

    try {
        const kbmStats = await fortnite.user(username, "kbm");
        if (!kbmStats.code) {
            stats.platforms.push(kbmStats);
        }
    }
    catch (e) {
        console.error(`Couldn't fetch kbmStats for ${username}`);
    }
    try {
        const touchStats = await fortnite.user(username, "touch");
        if (!touchStats.code) {
            stats.platforms.push(touchStats);
        }
    } catch (e) {
        console.error(`Couldn't fetch touchStats for ${username}`);
    }

    await set(`${username}-stats`, JSON.stringify(stats));
    return stats;
}

const renderImage = (username, stats) => {
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext("2d");

    const text = `${username} has ${sumAcrossPlatforms(stats.platforms, "lifetime", "wins")} total wins.`
    ctx.font = "20px Verdana";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(text, 0, 50);

    const attachment = new MessageAttachment(
        canvas.toBuffer(),
        "welcome-image.png"
    );
    return attachment;
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

        // message.channel.send(username, renderImage(username, stats));

        message.channel.send({
            embed: {
                title: username,
                description: `has ${sumAcrossPlatforms(stats.platforms, "lifetime", "wins")} total wins.`,
                fields: [
                    field("Solo Wins", sumAcrossPlatforms(stats.platforms, "solo", "wins")),
                    field("Duo Wins", sumAcrossPlatforms(stats.platforms, "duo", "wins")),
                    field("Squads Wins", sumAcrossPlatforms(stats.platforms, "squad", "wins")),
                ],
            },
        });
    },
};
