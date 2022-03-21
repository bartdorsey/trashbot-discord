import mc from 'minecraft-server-status-simple';
export default {
  name: 'mcstatus',
  description: 'minecraft server status',
  cooldown: 1,
  async execute(message: { channel: { send: (arg0: string) => void; }; }, args: any) {
    const status = await mc.status('bedrock', 'mc.echobucket.com', 19132);
    console.log(status);
    let response = '';
    if (status.online) {
      response = `Server Online ${status.map} -- Version: ${status.version} Mode: ${status.gamemode} Players: ${status.players.online}/${status.players.max}`;
    } else {
      response = "Server Offline"
    }
    message.channel.send(response);
  },
}