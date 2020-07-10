import { prefix } from "../config";

module.exports = {
    name: "help",
    description: "List all of my commands or info about a specific command.",
    aliases: ["commands"],
    usage: "[command name]",
    cooldown: 5,
    execute(message: { client: { commands: any; }; author: { send: (arg0: any[], arg1: { split: boolean; }) => Promise<any>; tag: any; }; channel: { type: string; send: (arg0: string[], arg1: { split: boolean; }) => void; }; reply: (arg0: string) => void; }, args: string | any[]) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push("Here's a list of all my commands:");
            data.push(commands.map((command: { name: any; }) => command.name).join(", "));
            data.push(
                `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`
            );

            return message.author
                .send(data, { split: true })
                .then(() => {
                    if (message.channel.type === "dm") return;
                    message.reply("I've sent you a DM with all my commands!");
                })
                .catch((error: any) => {
                    console.error(
                        `Could not send help DM to ${message.author.tag}.\n`,
                        error
                    );
                    message.reply("it seems like I can't DM you!");
                });
        }

        const name = args[0].toLowerCase();
        const command =
            commands.get(name) ||
            commands.find((c: { aliases: string | any[]; }) => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply("that's not a valid command!");
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases)
            data.push(`**Aliases:** ${command.aliases.join(", ")}`);
        if (command.description)
            data.push(`**Description:** ${command.description}`);
        if (command.usage)
            data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });
    },
};
