module.exports = {
	prefix: process.env.BOT_PREFIX || "!",
	token: process.env.BOT_TOKEN,
	redisURL: process.env.REDIS_URL || "redis://localhost:6379",
	fortniteTrackerAPIKey: process.env.FORTNITE_TRACKER_API_KEY
};
