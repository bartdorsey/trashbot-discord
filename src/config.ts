import { config }  from 'dotenv';
config();
export const prefix = process.env.BOT_PREFIX || "!";
export const token =  process.env.BOT_TOKEN;
export const redisURL = process.env.REDIS_URL || "redis://localhost:6379";
export const fortniteTrackerAPIKey = process.env.FORTNITE_TRACKER_API_KEY;

export const mcAPI = process.env.MC_API || "http://mc.echobucket.com:17394/execute"