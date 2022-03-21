import axios from 'axios';
import { mcAPI } from '../config';

export default {
  name: 'mc',
  description: 'minecraft server commands',
  cooldown: 1,
  async execute(message: { channel: { send: (arg0: string) => void; }; }, args: any) {
    const { data } = await axios.post(mcAPI, {
      command: args[0]
    });
    console.log(data);
    message.channel.send(data.response);
  },
}