const fs = require('fs');
const { Client, Collection, Message } = require('discord.js');
const { prefix, token } = require('./config');

const client = new Client();
client.commands = new Collection();
const cooldowns = new Collection();

const commandFiles = fs
.readdirSync('./commands')
.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', async () => {
    console.log(`Ready with prefix ${prefix}`);
    const me = client.users.cache.find(u => u.username === 'echobucket');
    me.send(`Ready with prefix ${prefix}`);
});

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name.startsWith('welcome'));
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the Trash Gang, ${member}`);
});

client.on('message', (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    if (message.channel.type === "dm") {
        console.log(
        `${message.author.username} sent ${message.content} to ${message.channel.recipient.username}`
        );
    } else {
        console.log(
        `${message.author.username} send ${message.content} to ${message.channel.name}`
        );
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
    client.commands.get(commandName) ||
    client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
        );

        if (!command) return;

        if (command.guildOnly && message.channel.type !== 'text') {
            return message.reply('I can\'t execute that command inside DMs!');
        }

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(
                    `please wait ${timeLeft.toFixed(
                        1,
                        )} more second(s) before reusing the \`${command.name}\` command.`,
                        );
                    }
                }

                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

                try {
                    command.execute(message, args);
                }
                catch (error) {
                    console.error(error);
                    message.reply('there was an error trying to execute that command!');
                }
            });

client.login(token);