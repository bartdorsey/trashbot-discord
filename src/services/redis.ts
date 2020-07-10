import redis from 'redis';
import { promisify } from 'util';
import { redisURL } from '../config';

const client = redis.createClient({
    url: redisURL
});

export const get = promisify(client.get).bind(client);
export const set = promisify(client.set).bind(client);

client.on("error", function (error: Error) {
    console.error(error);
});
