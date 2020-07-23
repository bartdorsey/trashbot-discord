import { Collection } from 'discord.js';
import { promises } from 'fs';

export const commands: Collection<any, any> = new Collection();

export async function getCommands() {
    const commandFiles = (await promises
    .readdir(`${__dirname}/commands`))
    .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        let command = await import(`${__dirname}/commands/${file}`);
        if (command && command.default) {
            command = command.default;
            console.log(command);
            commands.set(command.name, command);
        }
    }
    console.log("Loaded", commands.keys());
    return commands;
};