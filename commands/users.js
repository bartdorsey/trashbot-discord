module.exports = {
  name: "users",
  description: "Lists all the users on the server",
  cooldown: 5,
  execute(message, args) {
    const userList = message.client.users.cache;
    message.author.send({
        embed: {
            title: 'Users:',
            fields: userList.map(u => ({
                name: `${u.username}#${u.discriminator}`,
                value: u.bot ? ':robot:': ':slight_smile:',
                inline: true
            }))
        }
    });
  },
};
