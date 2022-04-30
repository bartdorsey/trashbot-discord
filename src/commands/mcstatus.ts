import { getJavaStatus, getBedrockStatus } from '../lib/minecraft';
import { Message, Channel } from 'discord.js';

const field = (name: string, value: any) => {
  return {
    name,
    value,
    inline: true
  }
}

export default {
  name: 'mcstatus',
  description: 'minecraft server status',
  cooldown: 1,
  async execute(message: Message, channel: Channel, args: any) {
    const bedrockStatus = await getBedrockStatus();
    const javaStatus = await getJavaStatus();
    
    if (bedrockStatus.online) {
      message.channel.send({
        embed: {
          title: 'Bedrock Server Status',
          description: bedrockStatus.motd,
          fields: [
            field("Online", bedrockStatus.online),
            field("Version", bedrockStatus.version),
            field("GameMode", bedrockStatus.gameMode),
            field("players", `${bedrockStatus.players.online}/${bedrockStatus.players.max}`),
            field("Host", bedrockStatus.hostname),
            field("Port", bedrockStatus.port)
          ],
        },
      });
    } else {
      message.channel.send({
        embed: {
          title: 'Bedrock Server Status',
          fields: [
            field("Online", bedrockStatus.online)
          ]
        }
      })
    }

    const javaPlayers = javaStatus.players.list.join(", ") || "None";

    if (javaStatus.online) {

      message.channel.send({
        embed: {
          title: 'Java Server Status',
          description: javaStatus.motd,
          fields: [
            field("Online", javaStatus.online),
            field("Players", `${javaStatus.players.online}/${javaStatus.players.max}`),
            field("PlayerList", javaPlayers),
            field("Host", `${javaStatus.hostname}.echobucket.com`),
            field("Port", javaStatus.port)
          ],
        },
      });
    } else {
      message.channel.send({
        embed: {
          title: 'Java Server Status',
          fields: [
            field("Online", javaStatus.online)
          ]
        }
      })
    }
  },
}