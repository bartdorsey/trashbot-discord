import { RCON } from 'minecraft-server-util';
const RCON_PORT = Number(process.env['RCON_PORT']) ?? 25576;
const JAVA_HOST = process.env.JAVA_HOST ?? 'localhost';
const RCON_PASSWORD = process.env.RCON_PASSWORD ?? 'minecraft';

const client = new RCON();

export async function getClient() {
    if (!client.isLoggedIn) {
        await client.connect(JAVA_HOST, RCON_PORT);
        await client.login(RCON_PASSWORD);
    }
    return client;
}
