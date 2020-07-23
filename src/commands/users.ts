export default {
  name: "users",
  description: "Lists all the users on the server",
  cooldown: 5,
  execute(message: { client: { users: { cache: any; }; }; author: { send: (arg0: { embed: { title: string; fields: any; }; }) => void; }; }, args: any) {
    const userList = message.client.users.cache;
    message.author.send({
        embed: {
            title: 'Users:',
            fields: userList.map((u: { username: any; discriminator: any; bot: any; }) => ({
                name: `${u.username}#${u.discriminator}`,
                value: u.bot ? ':robot:': ':slight_smile:',
                inline: true
            }))
        }
    });
  },
};
