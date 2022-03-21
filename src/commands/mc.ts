import axios from 'axios';
import { mcAPI } from '../config';

export default {
  name: 'mc',
  description: 'minecraft server commands',
  cooldown: 1,
  async execute(message: { channel: { send: (arg0: string) => void; }; }, args: any) {
    const command = args.join(" ");
    console.log(`Sending ${command} to minecraft.`);
    const { data } = await axios.post(mcAPI, {
      command
    });
    console.log(data);
    if (data.response === '\r\n') {
      message.channel.send("Error: empty response");
      return;
    }
    message.channel.send(data.response);
  },
}