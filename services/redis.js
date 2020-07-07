const redis = require("redis");
const { promisify } = require("util");
const { redisURL } = require('../config');
const client = redis.createClient({
    url: redisURL
});

const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);

client.on("error", function (error) {
    console.error(error);
});

module.exports = {
    get,
    set
}