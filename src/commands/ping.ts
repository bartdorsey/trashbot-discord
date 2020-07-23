export default {
    name: 'ping',
    description: 'Ping!',
    cooldown: 5,
    execute(message: { channel: { send: (arg0: string) => void; }; }) {
        message.channel.send('Pong.');
    },
};
