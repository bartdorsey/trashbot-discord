module.exports = {
	prefix: process.env.BOT_PREFIX || "!",
	token: process.env.BOT_TOKEN,
	redisURL: process.env.REDIS_URL || "redis://localhost:6379",
};
